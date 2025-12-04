const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Evaluator Login
exports.evaluatorLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [evaluators] = await pool.query(
      'SELECT * FROM evaluators WHERE username = ? AND is_active = TRUE',
      [username]
    );

    if (evaluators.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const evaluator = evaluators[0];
    const isMatch = await bcrypt.compare(password, evaluator.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: evaluator.id, 
        username: evaluator.username,
        evaluatorNumber: evaluator.evaluator_number,
        role: 'evaluator'
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: evaluator.id,
        username: evaluator.username,
        name: evaluator.name,
        evaluatorNumber: evaluator.evaluator_number
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [admins] = await pool.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};