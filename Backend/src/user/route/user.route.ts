import express from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controller/user.controller.ts"; // Import these
import { authentication } from "../../middlewares/auth.middleware.ts";
import { authorized } from "../../middlewares/role.middleware.ts";
import { login } from "../../middlewares/auth.controller.ts";

const router = express.Router();

router.post("/", createUser);
router.get("/", authentication, authorized("admin"), getUsers);
router.get("/:id", getUser);
router.put("/:id", authentication, authorized("admin"), updateUser);
router.delete("/:id", authentication, authorized("admin"), deleteUser);
router.post("/login", login);

export default router;
