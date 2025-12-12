import express from 'express';
import Complaint from '../models/Complaint.js';

const router = express.Router();

/* ================== ADMIN ENDPOINTS ================== */

// Get all complaints (admin)
router.get('/admin/all', async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('reporterId', 'name email')
            .populate('reportedUserId', 'name email')
            .sort({ createdAt: -1 });

        // Format the data for admin panel
        const formattedComplaints = complaints.map(complaint => ({
            id: complaint._id.toString(),
            reporter: complaint.reporterId?.name || 'Unknown',
            reportedUser: complaint.reportedUserId?.name || 'Unknown',
            reason: complaint.reason,
            description: complaint.description,
            date: new Date(complaint.createdAt).toLocaleDateString(),
            status: complaint.status
        }));

        res.status(200).json(formattedComplaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get specific complaint (admin)
router.get('/admin/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('reporterId', 'name email phone')
            .populate('reportedUserId', 'name email phone');

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json(complaint);
    } catch (error) {
        console.error("Error fetching complaint:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update complaint (resolve, add notes) (admin)
router.patch('/admin/:id', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        const updateData = { updatedAt: new Date() };
        if (status) {
            updateData.status = status;
            if (status === 'Resolved') {
                updateData.resolvedAt = new Date();
            }
        }
        if (adminNotes) updateData.adminNotes = adminNotes;

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint updated successfully", complaint });
    } catch (error) {
        console.error("Error updating complaint:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete complaint (admin)
router.delete('/admin/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        console.error("Error deleting complaint:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create a new complaint (user)
router.post('/create', async (req, res) => {
    try {
        const { reporterId, reportedUserId, reason, description } = req.body;

        if (!reporterId || !reportedUserId || !reason || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newComplaint = new Complaint({
            reporterId,
            reportedUserId,
            reason,
            description,
            status: 'Pending'
        });

        await newComplaint.save();

        res.status(201).json({ message: "Complaint submitted successfully", complaint: newComplaint });
    } catch (error) {
        console.error("Error creating complaint:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
