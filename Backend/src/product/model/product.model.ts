import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
        type: String,
      default: null
    },
    stock: {
      type: Number,
      default: 1,
    },
    categoryId: {
      type: Number,
      default: null,
    },
    subCategoryId: {
      type: [Number],
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);


const Product = mongoose.model("Product", productSchema)

export default Product;