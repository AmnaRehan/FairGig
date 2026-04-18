const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const GrievanceSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  worker_id: { type: String, required: true },
  platform: { type: String, required: true },
  category: { type: String, required: true }, // deactivation, commission, payment, other
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  status: { type: String, default: 'open' }, // open, escalated, resolved
  advocate_notes: String,
  similar_grievance_ids: [String],
  city: String,
  upvotes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Grievance = mongoose.model('Grievance', GrievanceSchema);

// Helper: find similar grievances by keyword overlap
async function findSimilar(title, description, excludeId) {
  const keywords = [...title.split(' '), ...description.split(' ')]
    .filter(w => w.length > 4)
    .slice(0, 6);
  const regex = keywords.map(k => new RegExp(k, 'i'));
  const similar = await Grievance.find({
    id: { $ne: excludeId },
    $or: [
      { title: { $in: regex } },
      { description: { $in: regex } }
    ]
  }).limit(5);
  return similar.map(g => g.id);
}

// POST /grievances — create
app.post('/grievances', async (req, res) => {
  try {
    const { worker_id, platform, category, title, description, city } = req.body;
    if (!worker_id || !platform || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const grievance = new Grievance({ id: uuidv4(), worker_id, platform, category, title, description, city });
    await grievance.save();
    grievance.similar_grievance_ids = await findSimilar(title, description, grievance.id);
    await grievance.save();
    res.status(201).json(grievance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /grievances — list all (public, paginated)
app.get('/grievances', async (req, res) => {
  try {
    const { page = 1, limit = 20, platform, category, status, city } = req.query;
    const filter = {};
    if (platform) filter.platform = platform;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (city) filter.city = city;
    const total = await Grievance.countDocuments(filter);
    const grievances = await Grievance.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ total, page: Number(page), grievances });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /grievances/:id
app.get('/grievances/:id', async (req, res) => {
  const g = await Grievance.findOne({ id: req.params.id });
  if (!g) return res.status(404).json({ error: 'Not found' });
  res.json(g);
});

// PATCH /grievances/:id/status — advocate updates status
app.patch('/grievances/:id/status', async (req, res) => {
  try {
    const { status, advocate_notes, tags } = req.body;
    const g = await Grievance.findOne({ id: req.params.id });
    if (!g) return res.status(404).json({ error: 'Not found' });
    if (status) g.status = status;
    if (advocate_notes) g.advocate_notes = advocate_notes;
    if (tags) g.tags = tags;
    g.updated_at = new Date();
    await g.save();
    res.json(g);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /grievances/:id/upvote
app.post('/grievances/:id/upvote', async (req, res) => {
  const g = await Grievance.findOne({ id: req.params.id });
  if (!g) return res.status(404).json({ error: 'Not found' });
  g.upvotes += 1;
  await g.save();
  res.json({ upvotes: g.upvotes });
});

// GET /grievances/stats/summary — for advocate dashboard
app.get('/grievances/stats/summary', async (req, res) => {
  try {
    const totalOpen = await Grievance.countDocuments({ status: 'open' });
    const totalEscalated = await Grievance.countDocuments({ status: 'escalated' });
    const byCategory = await Grievance.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const byPlatform = await Grievance.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);
    const topTags = await Grievance.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ totalOpen, totalEscalated, byCategory, byPlatform, topTags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'grievance' }));

app.listen(process.env.PORT || 3001, () => {
  console.log('Grievance service running on port 3001');
});