import express from 'express';
import { authentication } from '../../middlewares/auth.middleware.ts';
import { authorized } from '../../middlewares/role.middleware.ts';
import { changeOrderStatus, createOrder, getAllOrders, getUserOrder, getUserOrders, updateOrder } from '../controller/order.controller.ts';

const router = express.Router();

router.post('/', authentication, authorized('user'), createOrder);
router.put('/update', authentication, authorized('user'), updateOrder);
router.put('/status', authentication, authorized('admin'), changeOrderStatus);
router.get('/all', authentication, authorized('admin'), getAllOrders);
router.get('/user', authentication, authorized('user'), getUserOrder);
router.get('/userall', authentication, authorized('user'), getUserOrders);


export default router;