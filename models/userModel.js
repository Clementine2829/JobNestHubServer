// models/user.js
const db = require('../database/database');

async function getUserById(userId) {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}

async function createUser(user) {
  const [result] = await db.execute(
    'INSERT INTO users (id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)',
    [user.id, user.firstName, user.lastName, user.email, user.password]
  );

  // Check if the user was successfully inserted and return the user data
  if (result.affectedRows === 1) {
    return user;
  } else {
    throw new Error('User creation failed.');
  }
}

async function updateUser(userId, updatedUserData) {
  const [result] = await db.execute(
    'UPDATE users SET id = ?, first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?',
    [
      updatedUserData.id,
      updatedUserData.firstName,
      updatedUserData.lastName,
      updatedUserData.email,
      updatedUserData.password,
      userId,
    ]
  );

  // Check if the user was successfully updated and return the updated user data
  if (result.affectedRows === 1) {
    return updatedUserData;
  } else {
    throw new Error('User update failed.');
  }
}

module.exports = {
  getUserById,
  createUser,
  updateUser,
};
