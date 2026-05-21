import express from 'express';
import { createSubCategory, getAllSubCategories, getSubCategory, updateSubCategory } from '../controller/subcategory.controller.ts';
import { authentication } from '../../middlewares/auth.middleware.ts';
import { authorized } from '../../middlewares/role.middleware.ts';

const router = express.Router()


router.post('/', authentication, authorized('admin'), createSubCategory);
router.get("/", getAllSubCategories);
router.get("/:id", getSubCategory);
router.put('/:id', updateSubCategory);

export default router;