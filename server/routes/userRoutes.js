import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  logoutUser,
  verifyUserEmail,
  getPasswordResetCode
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

router.route("/verifyemail/:userId/:emailVerificationCode")
  .get(verifyUserEmail);

router.route("/resetpassword")
  .post(getPasswordResetCode);

export default router;