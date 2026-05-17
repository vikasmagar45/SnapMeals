import { query } from '../config/db.js'

const mapFood = (row) => {
  if (!row) return null

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    image: row.image,
    category: row.category,
  }
}

const foodModel = {
  async create({ name, description, price, image, category }) {
    const result = await query(
      `INSERT INTO foods (name, description, price, image, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, price, image, category]
    )
    return mapFood(result.rows[0])
  },

  async findAll() {
    const result = await query('SELECT * FROM foods ORDER BY created_at DESC')
    return result.rows.map(mapFood)
  },

  async findById(id) {
    const result = await query('SELECT * FROM foods WHERE id = $1', [id])
    return mapFood(result.rows[0])
  },

  async deleteById(id) {
    const result = await query('DELETE FROM foods WHERE id = $1 RETURNING *', [
      id,
    ])
    return mapFood(result.rows[0])
  },
}

export default foodModel
