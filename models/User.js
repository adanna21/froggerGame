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
      (name, score)
      VALUES ($1, $2) RETURNING *
    `,
    [user.name, user.score]
  )
}

User.update = (user, id) => {
  return db.none(
    `
      UPDATE users SET
      name = $1,
      score = $2,
      WHERE id = $3
    `,
    [user.name, user.score, id]
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
