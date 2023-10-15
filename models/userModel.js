const db = require('../database/database');
const getCurrentDateAndTime = require('../getCurrentTime')

async function findOneByEmail(email) {
    const [user] = await db.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return user[0];
}
async function findOneById(id) {
    const [user] = await db.execute(`SELECT user_id, firstname, lastname, email, profile_status, date_created, date_updated 
                                    FROM users 
                                    WHERE user_id = ?
                                    LIMIT 1`, [id]);
    return user[0];
}

async function createUser(user) {
    const currentTime = await getCurrentDateAndTime();
    const [result] = await db.execute(
        // users (user_id, firstname, lastname, email, password, date_created, date_mod, date_last_login, is_active) 
        `INSERT INTO 
        users (user_id, firstname, lastname, email, password, date_created) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, user.firstName, user.lastName, user.email, user.password, currentTime]
    );

    // Check if the user was successfully inserted and return the user data
    if (result.affectedRows === 1) {
        return user;
    } else {
        throw new Error('User creation failed.');
    }
}

async function updateUser(updatedUserData) {
    const currentTime = await getCurrentDateAndTime();
    const [result] = await db.execute(
      'UPDATE users SET firstname = ?, lastname = ?, email = ?, date_updated = ? WHERE user_id = ?',
      [
        updatedUserData.firstName,
        updatedUserData.lastName,
        updatedUserData.email,
        currentTime,
        updatedUserData.id,
    ]
    );
    return result.affectedRows;  
}

module.exports = {
    findOneByEmail,
    findOneById,
    createUser,
    updateUser,
};
