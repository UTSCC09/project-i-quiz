import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  sessionNumber: { type: Number, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  enrollment: { type: Number, default: 0 }
});

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, "Please provide a course code"]
  },
  courseName: {
    type: String,
    required: [true, "Please provide a course name"]
  },
  courseSemester: {
    type: String,
    required: [true, "Please provide a courseSemester"]
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide an instructor"]
  },
  accessCode: {
    type: String,
  },
  sessions: [SessionSchema],
  archived: {
    type: Boolean,
    default: false,
  },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }]
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;
