import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  usedProduct: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);