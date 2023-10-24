import { Router } from "express";
import {
  createCourse,
  getMyInstructedCourses,
  getMyEnrolledCourses,
  enrollInCourse,
  dropCourse
} from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createCourse)

router.route("/instructed")
  .get(protect, getMyInstructedCourses);

router.route("/enrolled")
  .get(protect, getMyEnrolledCourses);

router.route("/enroll")
  .post(protect, enrollInCourse);

router.route("/drop")
  .post(protect, dropCourse);

export default router;