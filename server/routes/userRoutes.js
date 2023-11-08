import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  logoutUser,
  verifyUser
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(registerUser)
  .get(protect, getUsers);

router.route("/login")
  .post(loginUser);

router.route("/logout")
  .get(logoutUser);

router.route("/verify/:userId/:emailConfirmationCode")
  .get(verifyUser);

export default router;