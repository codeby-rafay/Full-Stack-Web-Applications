const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all resumes for the authenticated user
router.get('/', authenticateToken, (req, res) => {
  try {
    const resumes = db.prepare(`
      SELECT r.*, t.name as template_name 
      FROM resumes r 
      LEFT JOIN templates t ON r.template_id = t.id 
      WHERE r.user_id = ? 
      ORDER BY r.updated_at DESC
    `).all(req.user.id);

    res.json(resumes);
  } catch (err) {
    console.error('Get resumes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single resume
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const resume = db.prepare(`
      SELECT r.*, t.name as template_name, t.layout_config 
      FROM resumes r 
      LEFT JOIN templates t ON r.template_id = t.id 
      WHERE r.id = ? AND r.user_id = ?
    `).get(req.params.id, req.user.id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new resume
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, template_id, data, ats_score, ats_feedback } = req.body;

    const result = db.prepare(`
      INSERT INTO resumes (user_id, title, template_id, data, ats_score, ats_feedback) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      title || 'Untitled Resume',
      template_id || 1,
      JSON.stringify(data || {}),
      ats_score || 0,
      JSON.stringify(ats_feedback || [])
    );

    const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(resume);
  } catch (err) {
    console.error('Create resume error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a resume
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { title, template_id, data, ats_score, ats_feedback } = req.body;

    const existing = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    db.prepare(`
      UPDATE resumes 
      SET title = ?, template_id = ?, data = ?, ats_score = ?, ats_feedback = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND user_id = ?
    `).run(
      title || existing.title,
      template_id || existing.template_id,
      data ? JSON.stringify(data) : existing.data,
      ats_score !== undefined ? ats_score : existing.ats_score,
      ats_feedback ? JSON.stringify(ats_feedback) : existing.ats_feedback,
      req.params.id,
      req.user.id
    );

    const updated = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Update resume error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a resume
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    db.prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
