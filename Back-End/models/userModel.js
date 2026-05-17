import { query } from '../config/db.js'

const mapUser = (row) => {
  if (!row) return null

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    cartData: row.cart_data || {},
  }
}

const userModel = {
  async findOne({ email }) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email])
    return mapUser(result.rows[0])
  },

  async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id])
    return mapUser(result.rows[0])
  },

  async create({ name, email, password }) {
    const result = await query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, password]
    )
    return mapUser(result.rows[0])
  },

  async updateCartData(id, cartData) {
    const result = await query(
      `UPDATE users
       SET cart_data = $2::jsonb
       WHERE id = $1
       RETURNING *`,
      [id, JSON.stringify(cartData)]
    )
    return mapUser(result.rows[0])
  },
}

export default userModel
