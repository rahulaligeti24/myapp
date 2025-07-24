const mongoose = require('mongoose');

// Camera Schema
const cameraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Incident Schema
const incidentSchema = new mongoose.Schema({
  cameraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camera',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Unauthorised Access',
      'Gun Threat',
      'Face Recognised',
      'Suspicious Activity',
      'Fire Hazard',
      'Medical Emergency'
    ]
  },
  tsStart: {
    type: Date,
    required: true
  },
  tsEnd: {
    type: Date,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
incidentSchema.index({ tsStart: -1 });
incidentSchema.index({ resolved: 1 });
incidentSchema.index({ cameraId: 1 });

const Camera = mongoose.model('Camera', cameraSchema);
const Incident = mongoose.model('Incident', incidentSchema);

module.exports = {
  Camera,
  Incident
};