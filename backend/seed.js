const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/securesight', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const cameraSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true }
});

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

// Seed data
const cameras = [
  { id: 'cam-01', name: 'Camera - 01', location: 'Shop Floor A' },
  { id: 'cam-02', name: 'Camera - 02', location: 'Vault' },
  { id: 'cam-03', name: 'Camera - 03', location: 'Entrance' }
];

const generateTimestamp = (hoursAgo) => {
  const now = new Date();
  return new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
};

const incidents = [
  {
    id: 'inc-001',
    cameraId: 'cam-01',
    camera: 'Shop Floor Camera A',
    type: 'Unauthorised Access',
    tsStart: generateTimestamp(2),
    tsEnd: generateTimestamp(1.5),
    thumbnailUrl: 'https://www.cctvcamerapros.com/v/4K/4K-security-camera-snapshot.jpg',
    resolved: false
  },
  {
    id: 'inc-002',
    cameraId: 'cam-01',
    camera: 'Shop Floor Camera A',
    type: 'Gun Threat',
    tsStart: generateTimestamp(4),
    tsEnd: generateTimestamp(3.5),
    thumbnailUrl: 'https://i.ytimg.com/vi/jZuOySqj6Fg/maxresdefault.jpg',
    resolved: false
  },
  {
    id: 'inc-003',
    cameraId: 'cam-01',
    camera: 'Shop Floor Camera A',
    type: 'Unauthorised Access',
    tsStart: generateTimestamp(6),
    tsEnd: generateTimestamp(5.5),
    thumbnailUrl: 'https://www.cctvcamerapros.com/v/4K/4K-security-camera-snapshot.jpg',
    resolved: false
  },
  {
    id: 'inc-004',
    cameraId: 'cam-01',
    camera: 'Shop Floor Camera A',
    type: 'Unauthorised Access',
    tsStart: generateTimestamp(8),
    tsEnd: generateTimestamp(7.5),
    thumbnailUrl: 'https://i.ytimg.com/vi/jZuOySqj6Fg/maxresdefault.jpg',
    resolved: false
  },
  {
    id: 'inc-005',
    cameraId: 'cam-01',
    camera: 'Shop Floor Camera A',
    type: 'Unauthorised Access',
    tsStart: generateTimestamp(10),
    tsEnd: generateTimestamp(9.5),
    thumbnailUrl: 'https://www.cctvcamerapros.com/v/4K/4K-security-camera-snapshot.jpg',
    resolved: false
  },
  {
    id: 'inc-006',
    cameraId: 'cam-02',
    camera: 'Vault Camera B',
    type: 'Face Recognised',
    tsStart: generateTimestamp(12),
    tsEnd: generateTimestamp(11.5),
    thumbnailUrl: 'https://i.ytimg.com/vi/jZuOySqj6Fg/maxresdefault.jpg',
    resolved: true
  },
  {
    id: 'inc-007',
    cameraId: 'cam-03',
    camera: 'Entrance Camera C',
    type: 'Traffic Congestion',
    tsStart: generateTimestamp(14),
    tsEnd: generateTimestamp(13.5),
    thumbnailUrl: 'https://www.cctvcamerapros.com/v/4K/4K-security-camera-snapshot.jpg',
    resolved: true
  },
  {
    id: 'inc-008',
    cameraId: 'cam-02',
    camera: 'Vault Camera B',
    type: 'Unauthorised Access',
    tsStart: generateTimestamp(16),
    tsEnd: generateTimestamp(15.5),
    thumbnailUrl: 'https://i.ytimg.com/vi/jZuOySqj6Fg/maxresdefault.jpg',
    resolved: false
  },
  {
    id: 'inc-009',
    cameraId: 'cam-03',
    camera: 'Entrance Camera C',
    type: 'Gun Threat',
    tsStart: generateTimestamp(18),
    tsEnd: generateTimestamp(17.5),
    thumbnailUrl: 'https://www.cctvcamerapros.com/v/4K/4K-security-camera-snapshot.jpg',
    resolved: false
  },
  {
    id: 'inc-010',
    cameraId: 'cam-01',
    camera: 'Shop Floor Camera A',
    type: 'Face Recognised',
    tsStart: generateTimestamp(20),
    tsEnd: generateTimestamp(19.5),
    thumbnailUrl: 'https://i.ytimg.com/vi/jZuOySqj6Fg/maxresdefault.jpg',
    resolved: true
  },
  {
    id: 'inc-011',
    cameraId: 'cam-02',
    camera: 'Vault Camera B',
    type: 'Traffic Congestion',
    tsStart: generateTimestamp(22),
    tsEnd: generateTimestamp(21.5),
    thumbnailUrl: 'https://www.cctvcamerapros.com/v/4K/4K-security-camera-snapshot.jpg',
    resolved: false
  },
  {
    id: 'inc-012',
    cameraId: 'cam-03',
    camera: 'Entrance Camera C',
    type: 'Unauthorised Access',
    tsStart: generateTimestamp(24),
    tsEnd: generateTimestamp(23.5),
    thumbnailUrl: 'https://i.ytimg.com/vi/jZuOySqj6Fg/maxresdefault.jpg',
    resolved: false
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Camera.deleteMany({});
    await Incident.deleteMany({});
    
    // Insert cameras
    await Camera.insertMany(cameras);
    console.log('Cameras seeded successfully');
    
    // Insert incidents
    await Incident.insertMany(incidents);
    console.log('Incidents seeded successfully');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();