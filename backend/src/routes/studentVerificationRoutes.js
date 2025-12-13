import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from '../lib/cloudinary.js';
import StudentVerification from '../models/StudentVerification.js';
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

// Submit student verification
router.post('/submit', protect, upload.fields([
    { name: 'schoolId', maxCount: 1 },
    { name: 'enrollmentProof', maxCount: 1 }
]), async (req, res) => {
    try {
        const { course, yearLevel } = req.body;

        // Validate required fields
        if (!course || !yearLevel) {
            return res.status(400).json({ message: 'Course and year level are required' });
        }

        // Check if files are uploaded
        if (!req.files?.schoolId || !req.files?.enrollmentProof) {
            return res.status(400).json({ message: 'Both School ID and Enrollment Proof are required' });
        }

        // Check if user already has a verification request
        const existingVerification = await StudentVerification.findOne({ userId: req.user._id });
        if (existingVerification) {
            return res.status(400).json({
                message: 'You already have a verification request',
                status: existingVerification.verificationStatus
            });
        }

        // Upload School ID to Cloudinary
        const schoolIdUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'SabayTa_Student_Verifications',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.files.schoolId[0].buffer);
        });

        // Upload Enrollment Proof to Cloudinary
        const enrollmentProofUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'SabayTa_Student_Verifications',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.files.enrollmentProof[0].buffer);
        });

        // Save to database
        const verification = await StudentVerification.create({
            userId: req.user._id,
            course,
            yearLevel,
            documents: {
                schoolId: schoolIdUpload.secure_url,
                enrollmentProof: enrollmentProofUpload.secure_url
            },
            verificationStatus: 'pending'
        });

        res.status(200).json({
            message: 'Student verification submitted successfully',
            verification
        });

    } catch (error) {
        console.error('Student verification error:', error);
        res.status(500).json({ message: 'Failed to submit verification', error: error.message });
    }
});

// Get user's verification status
router.get('/status', protect, async (req, res) => {
    try {
        const verification = await StudentVerification.findOne({ userId: req.user._id })
            .sort({ createdAt: -1 });

        if (verification) {
            res.status(200).json({
                hasVerification: true,
                verificationStatus: verification.verificationStatus,
                verification
            });
        } else {
            res.status(200).json({
                hasVerification: false,
                verificationStatus: null
            });
        }
    } catch (error) {
        console.error('Error checking verification status:', error);
        res.status(500).json({ message: 'Failed to check verification status' });
    }
});

// ADMIN: Get all verification requests
router.get('/admin/all', protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const verifications = await StudentVerification.find()
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        // Get UserProfile for each verification to include profilePicture
        const UserProfile = (await import('../models/UserProfile.js')).default;

        const verificationsWithProfile = await Promise.all(
            verifications.map(async (verification) => {
                // Skip if user has been deleted
                if (!verification.userId) {
                    console.log('Skipping verification with deleted user:', verification._id);
                    return null;
                }

                const userProfile = await UserProfile.findOne({ userId: verification.userId._id });
                return {
                    ...verification.toObject(),
                    userId: {
                        ...verification.userId.toObject(),
                        profilePicture: userProfile?.profileImage || null
                    }
                };
            })
        );

        // Filter out verifications with deleted users
        const validVerifications = verificationsWithProfile.filter(v => v !== null);

        res.status(200).json(validVerifications);

    } catch (error) {
        console.error('Error fetching verifications:', error);
        res.status(500).json({ message: 'Failed to fetch verifications' });
    }
});

// ADMIN: Update verification status
router.patch('/admin/:id', protect, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { verificationStatus } = req.body;

        if (!['verified', 'rejected'].includes(verificationStatus)) {
            return res.status(400).json({ message: 'Invalid status. Use "verified" or "rejected"' });
        }

        const verification = await StudentVerification.findByIdAndUpdate(
            req.params.id,
            { verificationStatus },
            { new: true }
        ).populate('userId', 'name email phone profilePicture');

        if (!verification) {
            return res.status(404).json({ message: 'Verification request not found' });
        }

        res.status(200).json({
            message: `Verification ${verificationStatus} successfully`,
            verification
        });

    } catch (error) {
        console.error('Error updating verification:', error);
        res.status(500).json({ message: 'Failed to update verification' });
    }
});

export default router;
