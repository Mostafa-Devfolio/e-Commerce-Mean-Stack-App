import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Category = mongoose.model("Category", categorySchema)

export default Category;