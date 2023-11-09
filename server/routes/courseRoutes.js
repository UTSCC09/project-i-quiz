import { Router } from "express";
import {
  createCourse,
  getMyInstructedCourses,
  getMyEnrolledCourses,
  getAllCourses,
  enrollInCourse,
  dropCourse,
  archiveCourse,
  setAccentColor,
  getCourseEnrollInfo,
  getEnrolledCourse,
  setAccessCode
} from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

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

router.route("/archive")
  .post(protect, archiveCourse);

router.route("/accent_color")
  .post(protect, setAccentColor);

router.route("/enrolled/:courseId")
  .get(protect, getEnrolledCourse);

router.route("/enroll_info/:accessCode")
  .get(protect, getCourseEnrollInfo);

router.route("/access_code")
  .post(protect, setAccessCode);

export default router;
