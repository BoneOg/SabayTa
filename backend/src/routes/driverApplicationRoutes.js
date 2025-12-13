import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from '../lib/cloudinary.js';
import DriverApplication from '../models/DriverApplication.js';
import User from '../models/User.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Auth middleware
const protect = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Submit driver application
router.post('/submit', protect, upload.fields([
    { name: 'driversLicense', maxCount: 1 },
    { name: 'vehicleORCR', maxCount: 1 }
]), async (req, res) => {
    try {
        const { plateNumber, motorcycleModel } = req.body;

        // Validate required fields
        if (!plateNumber || !motorcycleModel) {
            return res.status(400).json({ message: 'Plate number and motorcycle model are required' });
        }

        // Check if files are uploaded
        if (!req.files?.driversLicense || !req.files?.vehicleORCR) {
            return res.status(400).json({ message: 'Both Driver\'s License and Vehicle OR/CR are required' });
        }

        // Check if user already has an application
        const existingApplication = await DriverApplication.findOne({ userId: req.user._id });
        if (existingApplication) {
            return res.status(400).json({
                message: 'You already have a driver application',
                status: existingApplication.applicationStatus
            });
        }

        // Upload Driver's License to Cloudinary
        const driversLicenseUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'SabayTa_Driver_Applications',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.files.driversLicense[0].buffer);
        });

        // Upload Vehicle OR/CR to Cloudinary
        const vehicleORCRUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'SabayTa_Driver_Applications',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.files.vehicleORCR[0].buffer);
        });

        // Save to database
        const application = await DriverApplication.create({
            userId: req.user._id,
            plateNumber,
            motorcycleModel,
            documents: {
                driversLicense: driversLicenseUpload.secure_url,
                vehicleORCR: vehicleORCRUpload.secure_url
            },
            applicationStatus: 'pending'
        });

        res.status(200).json({
            message: 'Driver application submitted successfully',
            application
        });

    } catch (error) {
        console.error('Driver application error:', error);
        res.status(500).json({ message: 'Failed to submit application', error: error.message });
    }
});

// Get user's application status
router.get('/status', protect, async (req, res) => {
    try {
        const application = await DriverApplication.findOne({ userId: req.user._id })
            .sort({ createdAt: -1 });

        if (application) {
            res.status(200).json({
                hasApplication: true,
                application
            });
        } else {
            res.status(200).json({
                hasApplication: false
            });
        }
    } catch (error) {
        console.error('Error checking application status:', error);
        res.status(500).json({ message: 'Failed to check application status' });
    }
});

// ADMIN: Get all driver applications
router.get('/admin/all', protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const applications = await DriverApplication.find()
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        // Filter out applications where userId is null (deleted accounts)
        const validApplications = applications.filter(app => app.userId !== null);

        // Get UserProfile for each application to include profilePicture
        const UserProfile = (await import('../models/UserProfile.js')).default;

        const applicationsWithProfile = await Promise.all(
            validApplications.map(async (application) => {
                try {
                    const userProfile = await UserProfile.findOne({ userId: application.userId._id });
                    return {
                        ...application.toObject(),
                        userId: {
                            ...application.userId.toObject(),
                            profilePicture: userProfile?.profileImage || null
                        }
                    };
                } catch (error) {
                    console.error(`Error processing application ${application._id}:`, error);
                    return null;
                }
            })
        );

        // Filter out any null results from errors
        const finalApplications = applicationsWithProfile.filter(app => app !== null);

        res.status(200).json(finalApplications);

    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});

// ADMIN: Update application status
router.patch('/admin/:id', protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { applicationStatus } = req.body;

        if (!['approved', 'rejected'].includes(applicationStatus)) {
            return res.status(400).json({ message: 'Invalid status. Use "approved" or "rejected"' });
        }

        const application = await DriverApplication.findByIdAndUpdate(
            req.params.id,
            { applicationStatus },
            { new: true }
        ).populate('userId', 'name email phone profilePicture');


        // If approved, update user role to 'driver' and migrate profile
        if (applicationStatus === 'approved') {
            await User.findByIdAndUpdate(application.userId._id, { role: 'driver' });

            // Migrate profile from UserProfile to DriverProfile
            const UserProfile = (await import('../models/UserProfile.js')).default;
            const DriverProfile = (await import('../models/DriverProfile.js')).default;

            // Get existing user profile
            const userProfile = await UserProfile.findOne({ userId: application.userId._id });

            const driverProfileData = {
                userId: application.userId._id,
                profileImage: userProfile?.profileImage || '',
                street: userProfile?.street || '',
                barangay: userProfile?.barangay || '',
                city: userProfile?.city || '',
                province: userProfile?.province || '',
                postalCode: userProfile?.postalCode || '',
                vehiclePlateNumber: application.plateNumber || '',
                vehicleType: application.motorcycleModel || '',
                licenseNumber: '',
                isApproved: true
            };

            // Use findOneAndUpdate with upsert to create or update driver profile
            await DriverProfile.findOneAndUpdate(
                { userId: application.userId._id },
                driverProfileData,
                { upsert: true, new: true }
            );

            // Delete the user profile if it exists
            if (userProfile) {
                await UserProfile.findByIdAndDelete(userProfile._id);
            }
        }

        res.status(200).json({
            message: `Application ${applicationStatus} successfully`,
            application,
            roleChanged: applicationStatus === 'approved',
            profileMigrated: applicationStatus === 'approved'
        });

    } catch (error) {
        console.error('Error updating application:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Failed to update application',
            error: error.message
        });
    }
});

// ADMIN: One-time migration to set isApproved for existing drivers
router.post('/admin/migrate-approved-drivers', protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const DriverProfile = (await import('../models/DriverProfile.js')).default;
        const UserProfile = (await import('../models/UserProfile.js')).default;

        // Step 1: Update existing DriverProfiles to set isApproved = true
        const updateResult = await DriverProfile.updateMany(
            { isApproved: { $exists: false } },
            { $set: { isApproved: true } }
        );

        // Step 2: Find approved applications without DriverProfiles
        const approvedApplications = await DriverApplication.find({
            applicationStatus: 'approved'
        }).populate('userId');

        let created = 0;
        for (const application of approvedApplications) {
            // Check if DriverProfile exists
            const existingProfile = await DriverProfile.findOne({
                userId: application.userId._id
            });

            if (!existingProfile) {
                // Get user profile data
                const userProfile = await UserProfile.findOne({
                    userId: application.userId._id
                });

                // Create DriverProfile
                await DriverProfile.create({
                    userId: application.userId._id,
                    profileImage: userProfile?.profileImage || '',
                    street: userProfile?.street || '',
                    barangay: userProfile?.barangay || '',
                    city: userProfile?.city || '',
                    province: userProfile?.province || '',
                    postalCode: userProfile?.postalCode || '',
                    vehiclePlateNumber: application.plateNumber || '',
                    vehicleType: application.motorcycleModel || '',
                    licenseNumber: '',
                    isApproved: true
                });

                // Update user role
                await User.findByIdAndUpdate(application.userId._id, {
                    role: 'driver'
                });

                // Delete UserProfile if exists
                if (userProfile) {
                    await UserProfile.findByIdAndDelete(userProfile._id);
                }

                created++;
            }
        }

        res.status(200).json({
            message: 'Migration completed successfully',
            updatedExisting: updateResult.modifiedCount,
            createdMissing: created,
            total: updateResult.modifiedCount + created
        });

    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({
            message: 'Migration failed',
            error: error.message
        });
    }
});

export default router;
