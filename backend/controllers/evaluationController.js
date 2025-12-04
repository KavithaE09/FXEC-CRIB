const { pool } = require('../config/database');

// Submit Evaluation
exports.submitEvaluation = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      departmentCode,
      socialRelevance,
      creativity,
      naturalElements,
      nonVerbal
    } = req.body;

    const evaluatorId = req.user.id;

    // Get department ID
    const [departments] = await connection.query(
      'SELECT id FROM departments WHERE code = ?',
      [departmentCode]
    );

    if (departments.length === 0) {
      throw new Error('Department not found');
    }

    const departmentId = departments[0].id;

    // Check if already evaluated
    const [existing] = await connection.query(
      'SELECT id, is_locked FROM evaluations WHERE department_id = ? AND evaluator_id = ?',
      [departmentId, evaluatorId]
    );

    if (existing.length > 0 && existing[0].is_locked) {
      throw new Error('Evaluation already submitted and locked. Cannot modify.');
    }

    const totalMarks = parseFloat(socialRelevance) + parseFloat(creativity) + 
                       parseFloat(naturalElements) + parseFloat(nonVerbal);

    if (existing.length > 0) {
      // Update existing
      await connection.query(
        `UPDATE evaluations 
         SET social_relevance = ?, creativity = ?, natural_elements = ?, 
             non_verbal = ?, total_marks = ?, is_locked = TRUE
         WHERE id = ?`,
        [socialRelevance, creativity, naturalElements, nonVerbal, totalMarks, existing[0].id]
      );
    } else {
      // Insert new
      await connection.query(
        `INSERT INTO evaluations 
         (department_id, evaluator_id, social_relevance, creativity, natural_elements, non_verbal, total_marks, is_locked)
         VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [departmentId, evaluatorId, socialRelevance, creativity, naturalElements, nonVerbal, totalMarks]
      );
    }

    await connection.commit();
    res.json({ success: true, message: 'Evaluation submitted successfully' });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// Get Evaluator's Evaluations
exports.getMyEvaluations = async (req, res) => {
  try {
    const evaluatorId = req.user.id;

    const [evaluations] = await pool.query(
      `SELECT e.*, d.code as dept_code, d.name as dept_name
       FROM evaluations e
       JOIN departments d ON e.department_id = d.id
       WHERE e.evaluator_id = ?
       ORDER BY e.created_at DESC`,
      [evaluatorId]
    );

    res.json({ success: true, evaluations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Available Departments for Evaluation
exports.getAvailableDepartments = async (req, res) => {
  try {
    const evaluatorId = req.user.id;

    const [departments] = await pool.query(
      `SELECT d.*, 
       (SELECT COUNT(*) FROM evaluations e WHERE e.department_id = d.id AND e.evaluator_id = ?) as evaluated
       FROM departments d
       ORDER BY d.code`,
      [evaluatorId]
    );

    res.json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};