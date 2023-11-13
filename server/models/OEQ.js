import mongoose from "mongoose";

const OEQSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  prompt: {
    type: String,
    required: [true, "Please provide a prompt"],
  },
  maxLength: {
    type: Number,
    required: [true, "Please provide max length"],
  },
});

const OEQ = mongoose.model("OEQ", OEQSchema);
export default OEQ;
