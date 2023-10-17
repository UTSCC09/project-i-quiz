import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(registerUser)
  .get(protect, getUsers);

router.route("/login")
  .post(loginUser);

export default router;