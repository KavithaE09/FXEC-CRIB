
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});// Database Schema
const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Departments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Evaluators table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS evaluators (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        evaluator_number INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admin table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Evaluations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        department_id INT NOT NULL,
        evaluator_id INT NOT NULL,
        social_relevance DECIMAL(5,2) NOT NULL,
        creativity DECIMAL(5,2) NOT NULL,
        natural_elements DECIMAL(5,2) NOT NULL,
        non_verbal DECIMAL(5,2) NOT NULL,
        total_marks DECIMAL(5,2) NOT NULL,
        is_locked BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id),
        FOREIGN KEY (evaluator_id) REFERENCES evaluators(id),
        UNIQUE KEY unique_eval (department_id, evaluator_id)
      )
    `);

    console.log('✅ Database tables created successfully');

    // Insert default departments
    const depts = [
      ['1', 'Electronics & communication Engineering'],
      ['2', 'Master of Computer Applications'],
      ['3', 'Computer Science Engineering'],
      ['4', 'Master of Business Administration'],
      ['5', 'Mechanical Engineering'],
      ['6', 'Information Technology'],
      ['7', 'Civil Engineering'],
      ['8', 'Electrical & Electronics Engineering'],
      ['9', 'Computer Science & Business Systems'],
      ['10', 'Artificial Intelligence & Data Science and Artificial Intelligence & Machine Learning']
    ];

    for (const [code, name] of depts) {
      await connection.query(
        'INSERT IGNORE INTO departments (code, name) VALUES (?, ?)',
        [code, name]
      );
    }

    // Insert default evaluators (password: eval123)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('eval123', 10);
    
    await connection.query(
      'INSERT IGNORE INTO evaluators (username, password, name, evaluator_number) VALUES (?, ?, ?, ?)',
      ['evaluator1', hashedPassword, 'Evaluator 1', 1]
    );
    await connection.query(
      'INSERT IGNORE INTO evaluators (username, password, name, evaluator_number) VALUES (?, ?, ?, ?)',
      ['evaluator2', hashedPassword, 'Evaluator 2', 2]
    );

    // Insert default admin (password: admin123)
    const adminPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      'INSERT IGNORE INTO admins (username, password, name) VALUES (?, ?, ?)',
      ['admin', adminPassword, 'Administrator']
    );

    console.log('✅ Default data inserted');
    

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    connection.release();
  }
};

module.exports = { pool, createTables };