// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Create Task
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = new Task({
      title,
      description,
      user: req.user
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Tasks with optional filtering by status
router.get('/', auth, async (req, res) => {
  const { status } = req.query;
  let filter = { user: req.user };
  if (status) {
    filter.status = status;
  }
  try {
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task (e.g., status update)
router.put('/:id', auth, async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, description, status },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
