import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: [true, "Please provide a quiz name"]
  },
  startTime: {
    type: Date,
    required: [true, "Please provide a start time"]
  },
  endTime: {
    type: Date,
    required: [true, "Please provide an end time"]
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide a course"]
  },
  questions: [{ type: mongoose.Schema.Types.ObjectId }]
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;