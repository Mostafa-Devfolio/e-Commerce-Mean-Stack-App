import express from 'express';
import { authentication } from '../../middlewares/auth.middleware.ts';
import { authorized } from '../../middlewares/role.middleware.ts';
import { createTestimonial, getSingleTestmonial, updateTestimonial,
  deleteTestimonial, getTestmonials, getUserTestmonials, updateTestimonialStatus } from '../controller/testimonial.controller.ts';

const router = express.Router();

router.get("/all", getTestmonials);
router.get("/user", authentication, authorized("admin"), getUserTestmonials);
router.get("/single", authentication, authorized("admin"), getSingleTestmonial);
router.post("/", authentication, authorized("user"), createTestimonial);
router.put("/", authentication, authorized("admin"), updateTestimonialStatus);
router.put("/:id", authentication, authorized("admin"), updateTestimonial);
router.delete("/:id", authentication, authorized("admin"), deleteTestimonial);

export default router;