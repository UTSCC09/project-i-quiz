import mongoose from "mongoose";

const CLOSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  prompt: {
    type: String,
    required: [true, "Please provide a prompt"],
  },
  text: {
    type: String,
    required: [true, "Please provide text"],
  },
  answers: {
    type: [String],
  },
  maxScore: {
    type: Number,
    default: 0,
  },
});

const CLO = mongoose.model("CLO", CLOSchema);
export default CLO;
