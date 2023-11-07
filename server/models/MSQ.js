import mongoose from "mongoose";
import ChoiceSchema from "./Choice";

const MSQSchema = new mongoose.Schema({
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
  answers: {
    type: [String],
    required: [true, "Please provide answers"]
  }
});

const MSQ = mongoose.model("MSQ", MSQSchema);
export default MSQ;