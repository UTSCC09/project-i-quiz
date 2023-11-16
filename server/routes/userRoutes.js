import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  logoutUser,
  verifyUserEmail,
  requestPasswordReset,
  verifyPasswordResetCode,
  resetPassword
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { extractJwt } from "../middleware/jwtAuthMiddleware.js";
import SCOPES from "../constants/scopes.js";

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

router.route("/requestpasswordreset")
  .post(requestPasswordReset);

router.route("/verifypasswordresetcode")
  .post(extractJwt(SCOPES.VERIFY_PASSWORD_RESET_CODE), verifyPasswordResetCode);

router.route("/resetpassword")
  .post(extractJwt(SCOPES.RESET_PASSWORD), resetPassword);

export default router;