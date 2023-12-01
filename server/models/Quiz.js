import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a question"],
  },
  type: {
    type: String,
    enum: ["MCQ", "MSQ", "CLO", "OEQ"],
  },
});

const QuizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: [true, "Please provide a quiz name"],
  },
  isDraft: {
    type: Boolean,
    required: [true, "Please provide the released status"],
  },
  startTime: {
    type: Date,
    required: [
      function () {
        return !this.isDraft;
      },
      "Please provide a start time",
    ],
  },
  endTime: {
    type: Date,
    required: [
      function () {
        return !this.isDraft;
      },
      "Please provide an end time",
    ],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide a course"],
  },
  questions: [QuestionSchema],
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;
