const { pool } = require('../config/database');

// Get Final Results (Admin Only)
exports.getFinalResults = async (req, res) => {
  try {
    const [results] = await pool.query(
      `SELECT 
        d.code as dept_code,
        d.name as dept_name,
        SUM(e.total_marks) as total_marks,
        COUNT(e.id) as evaluation_count,
        GROUP_CONCAT(
          CONCAT('Eval', ev.evaluator_number, ':', e.total_marks) 
          ORDER BY ev.evaluator_number
        ) as individual_marks
       FROM departments d
       LEFT JOIN evaluations e ON d.id = e.department_id
       LEFT JOIN evaluators ev ON e.evaluator_id = ev.id
       GROUP BY d.id, d.code, d.name
       HAVING evaluation_count = 2
       ORDER BY total_marks DESC`
    );

    // Mark top 3
    const resultsWithRank = results.map((result, index) => ({
      ...result,
      rank: index + 1,
      medal: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null
    }));

    res.json({ success: true, results: resultsWithRank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Evaluations Detail (Admin Only)
exports.getAllEvaluations = async (req, res) => {
  try {
    const [evaluations] = await pool.query(
      `SELECT 
        e.*,
        d.code as dept_code,
        d.name as dept_name,
        ev.name as evaluator_name,
        ev.evaluator_number
       FROM evaluations e
       JOIN departments d ON e.department_id = d.id
       JOIN evaluators ev ON e.evaluator_id = ev.id
       ORDER BY d.code, ev.evaluator_number`
    );

    res.json({ success: true, evaluations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};