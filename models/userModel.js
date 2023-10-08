// models/user.js
const db = require('../database/database');

async function getUserById(userId) {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}

module.exports = {
  getUserById,
};
