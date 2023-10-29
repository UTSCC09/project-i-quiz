import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please provide an image"]
  },
  prompt: {
    type: String,
    required: [true, "Please provide a prompt"]
  },
  choices: {
    type: [String],
    required: [true, "Pleasse provide choices"]
  },
  answers: {
    type: [Number],
    required: [true, "Please provide answers"]
  }
});

const Grade = mongoose.model("Grade", GradeSchema);
export default Grade;