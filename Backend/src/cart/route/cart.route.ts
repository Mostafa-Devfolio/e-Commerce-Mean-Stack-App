import express from 'express';
import { authentication } from '../../middlewares/auth.middleware.ts';
import { authorized } from '../../middlewares/role.middleware.ts';
import { addToCart, getUserCart, removeCart, updateCart } from '../controller/cart.controller.ts';

const router = express.Router();

router.post('/', authentication, authorized('user'), addToCart);
router.delete('/', authentication, authorized('user'), removeCart);
router.post('/user', authentication, authorized('user'), getUserCart);
router.put("/", authentication, authorized("user"), updateCart);

export default router;