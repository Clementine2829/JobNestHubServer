const db = require('../database/database');

async function getJobById(id) {
    const [user] = await db.execute('SELECT * FROM jobs WHERE id = ?', [id]);
    return user[0];
}
async function getJobsTotal() {
    
}
async function getAllJobsByPages(pageNumber) {
    const [user] = await db.execute(`SELECT id, first_name, last_name, email, date_mod 
                                    FROM users 
                                    WHERE id = ?`, [id]);
    return user[0];
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

async function updateUser(updatedUserData) {
    const [result] = await db.execute(
      'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
      [
        updatedUserData.firstName,
        updatedUserData.lastName,
        updatedUserData.email,
        updatedUserData.id,
    ]
    );
    console.log("results " + result.affectedRows)
    return result.affectedRows;  
}

module.exports = {
    findOne,
    findOneById,
    createUser,
    updateUser,
};
