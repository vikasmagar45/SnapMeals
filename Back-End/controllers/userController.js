import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error' })
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body
  try {
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: 'Name, email, and password are required',
      })
    }

    // Cheacking is user already exists
    const exists = await userModel.findOne({ email })
    if (exists) {
      return res.json({ success: false, message: 'User already exists' })
    }

    // Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: 'Password must be at least 8 characters',
      })
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Creating new user
    const user = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    })

    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error' })
  }
}

export { loginUser, registerUser }
