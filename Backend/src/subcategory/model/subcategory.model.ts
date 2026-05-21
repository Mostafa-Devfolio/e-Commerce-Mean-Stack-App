import mongoose from "mongoose";


const subcategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const SubCategory = mongoose.model("SubCategory", subcategorySchema);

export default SubCategory;