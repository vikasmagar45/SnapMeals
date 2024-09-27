import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(
      'mongodb+srv://vikas121magar:Modern14@foodapp.e20buak.mongodb.net/FoodApp'
    ).then(() => console.log('MongoDB connected')).catch((err) => console.log(err));
}