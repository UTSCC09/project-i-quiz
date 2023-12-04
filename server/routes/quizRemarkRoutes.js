import { Router } from "express";
import {
    createQuizRemark,
    getMyQuizRemark,
    getAllQuizRemarks,
    resolveQuizRemark,
    getRemarkStudentInfo,
    getRemarkInstructorInfo,
    deleteQuizRemark
} from "../controllers/quizRemarkController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createQuizRemark);

router.route("/:quizRemarkId")
  .delete(protect, deleteQuizRemark);

router.route("/my/:quizId")
  .get(protect, getMyQuizRemark);

router.route("/all/:quizId")
  .get(protect, getAllQuizRemarks);

router.route("/resolve/:quizRemarkId")
  .patch(protect, resolveQuizRemark);

router.route("/studentInfo/:quizRemarkId")
  .get(protect, getRemarkStudentInfo);

router.route("/instructorInfo/:quizRemarkId")
  .get(protect, getRemarkInstructorInfo);

export default router;