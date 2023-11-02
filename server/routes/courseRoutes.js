import { Router } from "express";
import {
  createCourse,
  getMyInstructedCourses,
  getMyEnrolledCourses,
  getAllCourses,
  enrollInCourse,
  dropCourse,
  setAccentColor,
  getCourseEnrollInfo
} from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/enrollInfo/:accessCode")
  .get(protect, getCourseEnrollInfo);

router.route("/")
  .post(protect, createCourse)
  .get(protect, getAllCourses);

router.route("/instructed")
  .get(protect, getMyInstructedCourses);

router.route("/enrolled")
  .get(protect, getMyEnrolledCourses);

router.route("/enroll")
  .post(protect, enrollInCourse);

router.route("/drop")
  .post(protect, dropCourse);

router.route("/accentColor")
  .post(protect, setAccentColor);

export default router;
