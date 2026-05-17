import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(
  /\/$/,
  ''
)

// Placing user order for frontend
const placeOrder = async (req, res) => {
  try {
    const newOrder = await orderModel.create({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    })
    await userModel.updateCartData(req.body.userId, {})

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }))

    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    })
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    })
    console.log(session)

    res.json({ success: true, session_url: session.url })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error' })
  }
}

const verifyOrder = async (req, res) => {
  const { success, orderId } = req.body
  try {
    if (success == 'true') {
      await orderModel.updatePayment(orderId, true)
      res.json({ success: true, message: 'Order placed successfully' })
    } else {
      await orderModel.deleteById(orderId)
      res.json({ success: false, message: 'Payment failed' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error' })
  }
}
// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.findByUserId(req.body.userId)
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error' })
  }
}

// Listing orders for admin panel

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.findAll()
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error' })
  }
}

// api for updating order status

const updateStatus = async (req, res) => {
  try {
    await orderModel.updateStatus(req.body.orderId, req.body.status)
    res.json({ success: true, message: 'Order status updated successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error' })
  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }
