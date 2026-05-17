import { query } from '../config/db.js'

const mapOrder = (row) => {
  if (!row) return null

  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    items: row.items,
    amount: row.amount,
    address: row.address,
    status: row.status,
    date: row.date,
    payment: row.payment,
  }
}

const orderModel = {
  async create({ userId, items, amount, address }) {
    const result = await query(
      `INSERT INTO orders (user_id, items, amount, address)
       VALUES ($1, $2::jsonb, $3, $4::jsonb)
       RETURNING *`,
      [userId, JSON.stringify(items), amount, JSON.stringify(address)]
    )
    return mapOrder(result.rows[0])
  },

  async findByUserId(userId) {
    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    )
    return result.rows.map(mapOrder)
  },

  async findAll() {
    const result = await query('SELECT * FROM orders ORDER BY date DESC')
    return result.rows.map(mapOrder)
  },

  async updatePayment(id, payment) {
    const result = await query(
      'UPDATE orders SET payment = $2 WHERE id = $1 RETURNING *',
      [id, payment]
    )
    return mapOrder(result.rows[0])
  },

  async updateStatus(id, status) {
    const result = await query(
      'UPDATE orders SET status = $2 WHERE id = $1 RETURNING *',
      [id, status]
    )
    return mapOrder(result.rows[0])
  },

  async deleteById(id) {
    const result = await query('DELETE FROM orders WHERE id = $1 RETURNING *', [
      id,
    ])
    return mapOrder(result.rows[0])
  },
}

export default orderModel
