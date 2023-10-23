import { Router } from "express";
import {
  createCourse,
  getCoursesInstructedBy,
  getCoursesEnrolledIn,
  enrollInCourse,
  dropCourse
} from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createCourse)

router.route("/instructed/:instructorId")
  .get(protect, getCoursesInstructedBy);

router.route("/enrolled")
  .get(protect, getCoursesEnrolledIn);

router.route("/enroll")
  .post(protect, enrollInCourse);

router.route("/drop")
  .post(protect, dropCourse);

export default router;