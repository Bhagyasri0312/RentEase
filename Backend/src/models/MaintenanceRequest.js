// MaintenanceRequest Model
const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      required: [true, "Rental reference is required"],
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a maintenance title"],
      minlength: 10,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a detailed description"],
      minlength: 20,
    },
    category: {
      type: String,
      enum: [
        "Damage",
        "Malfunction",
        "Missing Parts",
        "Cleaning Required",
        "Parts Replacement",
        "General Maintenance",
        "Other",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["Open", "InProgress", "OnHold", "Resolved", "Closed", "Rejected"],
      default: "Open",
      index: true,
    },
    images: [
      {
        url: String,
        public_id: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    costApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    costApprovedAt: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedAt: Date,
    assignmentHistory: [
      {
        technicianId: mongoose.Schema.Types.ObjectId,
        assignedAt: Date,
        unassignedAt: Date,
        reason: String,
      },
    ],
    resolution: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      resolutionNotes: {
        type: String,
        minlength: 10,
      },
      resolutionDate: Date,
      partsReplaced: [String],
      workHours: Number,
    },
    userFeedback: {
      satisfactionRating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: {
        type: String,
        maxlength: 500,
      },
      feedbackDate: Date,
    },
    timeline: [
      {
        action: {
          type: String,
          enum: [
            "Created",
            "Assigned",
            "InProgress",
            "Resolved",
            "Closed",
            "Rejected",
            "OnHold",
          ],
        },
        description: String,
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    estimatedCompletionDate: Date,
    actualCompletionDate: Date,
    rejectionReason: {
      type: String,
      maxlength: 300,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Pre-save hook to generate ticket number
maintenanceRequestSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    this.ticketNumber = `TKT-${date}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

// Method to assign maintenance to technician
maintenanceRequestSchema.methods.assignTechnician = function (technicianId) {
  // Store assignment history
  if (this.assignedTo) {
    this.assignmentHistory.push({
      technicianId: this.assignedTo,
      unassignedAt: new Date(),
      reason: "Reassigned",
    });
  }

  this.assignedTo = technicianId;
  this.assignedAt = new Date();
  this.status = "InProgress";

  this.timeline.push({
    action: "Assigned",
    description: `Assigned to technician ${technicianId}`,
    performedBy: technicianId,
    timestamp: new Date(),
  });

  return this;
};

// Method to resolve maintenance request
maintenanceRequestSchema.methods.resolveRequest = function (
  technicianId,
  resolutionNotes,
  partsReplaced = [],
) {
  this.resolution.resolvedBy = technicianId;
  this.resolution.resolutionNotes = resolutionNotes;
  this.resolution.resolutionDate = new Date();
  this.resolution.partsReplaced = partsReplaced;
  this.actualCompletionDate = new Date();
  this.status = "Resolved";

  this.timeline.push({
    action: "Resolved",
    description: resolutionNotes,
    performedBy: technicianId,
    timestamp: new Date(),
  });

  return this;
};

// Method to close request
maintenanceRequestSchema.methods.closeRequest = function (performedBy) {
  this.status = "Closed";
  this.timeline.push({
    action: "Closed",
    description: "Request closed after resolution",
    performedBy,
    timestamp: new Date(),
  });
  return this;
};

// Method to reject maintenance request
maintenanceRequestSchema.methods.rejectRequest = function (
  reason,
  performedBy,
) {
  this.status = "Rejected";
  this.rejectionReason = reason;

  this.timeline.push({
    action: "Rejected",
    description: `Rejected: ${reason}`,
    performedBy,
    timestamp: new Date(),
  });

  return this;
};

// Method to put on hold
maintenanceRequestSchema.methods.putOnHold = function (reason, performedBy) {
  this.status = "OnHold";
  this.timeline.push({
    action: "OnHold",
    description: `On hold: ${reason}`,
    performedBy,
    timestamp: new Date(),
  });

  return this;
};

// Method to add feedback
maintenanceRequestSchema.methods.addFeedback = function (rating, feedback) {
  this.userFeedback.satisfactionRating = rating;
  this.userFeedback.feedback = feedback;
  this.userFeedback.feedbackDate = new Date();

  return this;
};

// Static method to get pending requests
maintenanceRequestSchema.statics.getPendingRequests = function () {
  return this.find({ status: { $in: ["Open", "InProgress"] } })
    .populate("user", "name email phone")
    .populate("assignedTo", "name email")
    .sort({ priority: -1, createdAt: 1 });
};

// Static method to get unassigned requests
maintenanceRequestSchema.statics.getUnassignedRequests = function () {
  return this.find({ status: "Open", assignedTo: null })
    .populate("user", "name email phone")
    .sort({ priority: -1, createdAt: 1 });
};

// Static method to get technician workload
maintenanceRequestSchema.statics.getTechnicianWorkload = function (
  technicianId,
) {
  return this.find({
    assignedTo: technicianId,
    status: { $in: ["InProgress", "OnHold"] },
  }).select("title priority status createdAt");
};

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
