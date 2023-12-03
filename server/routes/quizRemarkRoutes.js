import { Router } from "express";
import {
    createQuizRemark,
    getMyQuizRemark,
    getAllQuizRemarks,
    resolveQuizRemark,
} from "../controllers/quizRemarkController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createQuizRemark)

router.route("/my/:quizId")
  .get(protect, getMyQuizRemark)

router.route("/all/:quizId")
  .get(protect, getAllQuizRemarks)

router.route("/resolve/:quizRemarkId")
  .patch(protect, resolveQuizRemark)

export default router;