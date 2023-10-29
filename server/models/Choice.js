import mongoose from "mongoose";

const ChoiceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Please provide a choice id"]
  },
  content: {
    type: String,
    required: [true, "Please provide choice text"]
  }
});

export default ChoiceSchema;