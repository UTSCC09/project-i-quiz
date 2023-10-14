import { Router } from "express";
import {
  createCourse,
  enrollInCourse,
  dropCourse,
  getCourses
} from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .post(protect, createCourse)
  .get(protect, getCourses);

router.route("/enroll")
  .post(protect, enrollInCourse);

router.route("/drop")
  .post(protect, dropCourse);

export default router;