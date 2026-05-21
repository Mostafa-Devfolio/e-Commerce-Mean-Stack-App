import express from 'express';
import { createProduct, getProducts, updateProduct } from '../controller/product.controller.ts';
import { authentication } from '../../middlewares/auth.middleware.ts';
import { authorized } from '../../middlewares/role.middleware.ts';

const router = express.Router();

router.post("/", authentication, authorized('admin'), createProduct);
router.put("/:id", authentication, authorized('admin'), updateProduct)
router.get('/', getProducts)

export default router;