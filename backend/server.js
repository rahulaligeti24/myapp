const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/securesight', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Camera Schema
const cameraSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true }
});

// Incident Schema
const incidentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  cameraId: { type: String, required: true },
  camera: { type: String, required: true },
  type: { type: String, required: true },
  tsStart: { type: Date, required: true },
  tsEnd: { type: Date, required: true },
  thumbnailUrl: { type: String, required: true },
  resolved: { type: Boolean, default: false }
});

const Camera = mongoose.model('Camera', cameraSchema);
const Incident = mongoose.model('Incident', incidentSchema);

// API Routes

// Get all incidents (newest first, with resolved filter)
app.get('/api/incidents', async (req, res) => {
  try {
    const { resolved = 'false' } = req.query;
    const filter = resolved === 'false' ? { resolved: false } : {};
    
    const incidents = await Incident.find(filter)
      .sort({ tsStart: -1 })
      .limit(50);
    
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single incident by ID
app.get('/api/incidents/:id', async (req, res) => {
  try {
    const incident = await Incident.findOne({ id: req.params.id });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve/unresolve incident
app.patch('/api/incidents/:id/resolve', async (req, res) => {
  try {
    const incident = await Incident.findOne({ id: req.params.id });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    incident.resolved = !incident.resolved;
    await incident.save();
    
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all cameras
app.get('/api/cameras', async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get incident stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalIncidents = await Incident.countDocuments();
    const unresolvedIncidents = await Incident.countDocuments({ resolved: false });
    const resolvedIncidents = await Incident.countDocuments({ resolved: true });
    
    const incidentsByType = await Incident.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total: totalIncidents,
      unresolved: unresolvedIncidents,
      resolved: resolvedIncidents,
      byType: incidentsByType
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});