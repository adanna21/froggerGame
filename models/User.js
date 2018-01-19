const db = require('../db/config')

const User = {}

User.findAll = () => {
  return db.query('SELECT * FROM users ORDER BY id ASC')
}

User.findById = id => {
  return db.oneOrNone(`SELECT * FROM users WHERE id = $1`, [id])
}

User.create = user => {
  return db.one(
    `
      INSERT INTO users
      (score)
      VALUES ($1) RETURNING *
    `,
    [user.score]
  )
}

User.update = (user, id) => {
  return db.none(
    `
      UPDATE users SET
      score = $1,
      WHERE id = $2
    `,
    [user.score, id]
  )
}

User.destroy = id => {
  return db.none(
    `
      DELETE FROM users
      WHERE id = $1
    `,
    [id]
  )
}

module.exports = User
