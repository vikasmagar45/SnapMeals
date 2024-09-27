import foodModel from '../models/foodModel.js'
import fs from 'fs'

// Add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: image_filename,
    category: req.body.category,
  })
  try {
    await food.save()
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
    const foods = await foodModel.find({})
    res.json({ success: true, data: foods })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete food item

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id)
    fs.unlink(`uploads/${food.image}`, () => {} )

    await foodModel.findByIdAndDelete(req.body.id)
    res.status(200).json({ success: true, message: 'Food item deleted successfully' })
    }catch (err) {
    res.status(500).json({ message: err.message })
    }}


export { addFood, listFood, removeFood }
