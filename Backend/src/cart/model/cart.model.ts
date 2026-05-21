import mongoose from "mongoose";


const cartItemSchema = {
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  priceWhileAdding: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  isPriceChanged: {
    type: Boolean,
    default: false,
  },
};

const cartSchema = new mongoose.Schema({
  cartItems: [cartItemSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total: {
    type: Number,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;