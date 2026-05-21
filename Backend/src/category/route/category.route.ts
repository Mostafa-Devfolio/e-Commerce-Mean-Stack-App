import express from 'express';
import { addCategory, editCategory, getCategories, getCategory } from '../controller/category.controller.ts';
import { authentication } from '../../middlewares/auth.middleware.ts';
import { authorized } from '../../middlewares/role.middleware.ts';

const router = express.Router();

router.post('/', authentication, authorized('admin'), addCategory);
router.get('/category', authentication, authorized('user'), getCategory);
router.get("/categoryAll", getCategories);
router.get("/categories", authentication, authorized("admin"), getCategories);
router.put('/', authentication, authorized("admin"), editCategory);

export default router;