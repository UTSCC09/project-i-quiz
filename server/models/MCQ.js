import mongoose from "mongoose";
import Choice from "./Choice";
import ChoiceSchema from "./Choice";

const MCQSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please provide an image"]
  },
  prompt: {
    type: String,
    required: [true, "Please provide a prompt"]
  },
  choices: {
    type: [ChoiceSchema],
    required: [true, "Please provide choices"]
  },
  answer: {
    type: [String],
    required: [true, "Please provide answer"]
  }
});

const MCQ = mongoose.model("MCQ", MCQSchema);
export default MCQ;