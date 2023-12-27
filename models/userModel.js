const db = require("../databases/users_database");
const getCurrentDateAndTime = require("../getCurrentTime");

async function findUserByEmail(email) {
  const [user] = await db.execute(
    `SELECT user_id, firstname, lastname, email, password, profile_status, user_type
        FROM users 
        WHERE email = ? LIMIT 1`,
    [email]
  );
  return user[0];
}
async function findUserById(id) {
  const [user] = await db.execute(
    `SELECT user_id, firstname, lastname, email, profile_status, user_type, date_created, date_updated 
    FROM users 
    WHERE user_id = ?
    LIMIT 1`,
    [id]
  );
  return user[0];
}
async function findUserProfileById(id) {
  const user = await findUserById(id);
  return structuredProfile(user);
}
async function structuredProfile(user) {
  if (user) {
    const profile = {
      0: "activated",
      1: "notActivated",
      2: "disabled",
    };

    const modUser = {
      ...user,
      status: profile[user.profile_status],
      role: user.user_type,
      gender: "N/A",
      dateOfBirth: "N/A",
      phone: "N/A",
      address: "N/A",
    };
    delete modUser.user_type;
    delete modUser.profile_status;
    return modUser;
  }
  return {};
}

async function createUser(user) {
  const currentTime = await getCurrentDateAndTime();
  const [result] = await db.execute(
    // users (user_id, firstname, lastname, email, password, date_created, date_mod, date_last_login, is_active)
    `INSERT INTO 
        users (user_id, firstname, lastname, email, password, date_created) 
        VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      currentTime,
    ]
  );

  if (result.affectedRows === 1) {
    return user;
  } else {
    throw new Error("User creation failed.");
  }
}

async function emailSubscription(id, email) {
  const [result] = await db.execute(
    `INSERT INTO 
    subscribers (subscriber_id, email) 
    VALUES (?, ?)`,
    [id, email]
  );

  if (result.affectedRows === 1) {
    return { status: "success" };
  } else {
    throw new Error("User creation failed.");
  }
}
async function getEmailSubscription(email) {
  const sql = `SELECT subscriber_id FROM subscribers WHERE email = ? LIMIT 1`;
  const [user] = await db.execute(sql, [email]);
  return user.length > 0;
}

async function updateUser(updatedUserData) {
  const currentTime = await getCurrentDateAndTime();
  const [result] = await db.execute(
    "UPDATE users SET firstname = ?, lastname = ?, email = ?, date_updated = ? WHERE user_id = ?",
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
  findUserByEmail,
  findUserById,
  findUserProfileById,
  createUser,
  updateUser,
  emailSubscription,
  getEmailSubscription,
};
