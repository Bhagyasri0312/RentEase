// Maintenance Request Controller
const MaintenanceRequest = require("../models/MaintenanceRequest");
const Rental = require("../models/Rental");

// @desc    Create new maintenance request
// @route   POST /api/v1/maintenance
// @access  Private
exports.createRequest = async (req, res) => {
  try {
    const {
      rentalId,
      productId,
      title,
      description,
      category,
      priority,
      images,
    } = req.body;

    if (!rentalId || !productId || !title || !description || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Verify rental exists and belongs to user
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    }

    if (
      rental.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Create maintenance request
    const request = await MaintenanceRequest.create({
      user: req.user.userId,
      rental: rentalId,
      product: productId,
      title,
      description,
      category,
      priority: priority || "Medium",
      images: images || [],
      timeline: [
        {
          action: "Created",
          description: "Maintenance request created",
          performedBy: req.user.userId,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Maintenance request created successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all maintenance requests for user
// @route   GET /api/v1/maintenance
// @access  Private
exports.getUserRequests = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;

    let filter = { user: req.user.userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await MaintenanceRequest.countDocuments(filter);
    const requests = await MaintenanceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("rental")
      .populate("product");

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      pages: Math.ceil(total / limitNum),
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single maintenance request
// @route   GET /api/v1/maintenance/:id
// @access  Private
exports.getRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate("user")
      .populate("rental")
      .populate("product")
      .populate("assignedTo")
      .populate("resolution.resolvedBy");

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Check authorization
    if (
      request.user._id.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to view this request",
        });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update maintenance request
// @route   PUT /api/v1/maintenance/:id
// @access  Private
exports.updateRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      images,
      damageImages,
      damageNotes,
      estimatedCompletionDate,
    } = req.body;

    let request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Check authorization
    if (
      request.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to update this request",
        });
    }

    // Update fields
    if (title) request.title = title;
    if (description) request.description = description;
    if (category) request.category = category;
    if (priority) request.priority = priority;
    if (images) request.images = images;
    if (damageImages) {
      request.condition.damageImages = damageImages;
    }
    if (damageNotes) request.condition.damageNotes = damageNotes;
    if (estimatedCompletionDate)
      request.estimatedCompletionDate = estimatedCompletionDate;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign technician to request (Admin only)
// @route   PUT /api/v1/maintenance/:id/assign
// @access  Private/Admin
exports.assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return res
        .status(400)
        .json({ success: false, message: "Technician ID is required" });
    }

    let request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    request.assignTechnician(technicianId);
    await request.save();

    res.status(200).json({
      success: true,
      message: "Technician assigned successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resolve maintenance request
// @route   PUT /api/v1/maintenance/:id/resolve
// @access  Private/Admin
exports.resolveRequest = async (req, res) => {
  try {
    const { resolutionNotes, estimatedCost, actualCost } = req.body;

    let request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    request.resolveRequest(req.user.userId, resolutionNotes);
    if (estimatedCost) request.estimatedCost = estimatedCost;
    if (actualCost) request.actualCost = actualCost;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request resolved successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Close maintenance request
// @route   PUT /api/v1/maintenance/:id/close
// @access  Private
exports.closeRequest = async (req, res) => {
  try {
    let request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // Check authorization
    if (
      request.user.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to close this request",
        });
    }

    request.closeRequest();
    await request.save();

    res.status(200).json({
      success: true,
      message: "Request closed successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject maintenance request
// @route   PUT /api/v1/maintenance/:id/reject
// @access  Private/Admin
exports.rejectRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    let request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    request.status = "Rejected";
    request.rejectionReason = rejectionReason;
    request.timeline.push({
      action: "Rejected",
      description: rejectionReason,
      performedBy: req.user.userId,
    });

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit user feedback
// @route   PUT /api/v1/maintenance/:id/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
  try {
    const { satisfactionRating, feedback } = req.body;

    if (
      !satisfactionRating ||
      satisfactionRating < 1 ||
      satisfactionRating > 5
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      {
        "userFeedback.satisfactionRating": satisfactionRating,
        "userFeedback.feedback": feedback,
        "userFeedback.feedbackDate": new Date(),
      },
      { new: true },
    );

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all maintenance requests (Admin only)
// @route   GET /api/v1/admin/maintenance
// @access  Private/Admin
exports.getAllRequests = async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await MaintenanceRequest.countDocuments(filter);
    const requests = await MaintenanceRequest.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("user")
      .populate("rental")
      .populate("product")
      .populate("assignedTo");

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      pages: Math.ceil(total / limitNum),
      requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
