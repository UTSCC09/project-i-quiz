import mongoose from "mongoose";

const CLOSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please provide an image"]
  },
  prompt: {
    type: String,
    required: [true, "Please provide a prompt"]
  },
  text: {
    type: String,
    required: [true, "Please provide text"]
  },
  answers: {
    type: [String],
    required: [true, "Please provide answers"]
  }
});

const CLO = mongoose.model("CLO", CLOSchema);
export default CLO;