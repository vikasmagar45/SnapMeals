import foodModel from '../models/foodModel.js'
import fs from 'fs'

// Add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`

  try {
    await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      image: image_filename,
      category: req.body.category,
    })
    res
      .status(200)
      .json({ message: 'Food item added successfully', success: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// All food list

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.findAll()
    res.json({ success: true, data: foods })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete food item

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id)

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: 'Food item not found' })
    }

    fs.unlink(`uploads/${food.image}`, () => {})
    await foodModel.deleteById(req.body.id)
    res
      .status(200)
      .json({ success: true, message: 'Food item deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


export { addFood, listFood, removeFood }
