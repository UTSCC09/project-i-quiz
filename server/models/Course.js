import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
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
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessions: [SessionSchema]
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;