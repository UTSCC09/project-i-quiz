import mongoose from "mongoose";
import ChoiceSchema from "./Choice.js";

const MCQSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  prompt: {
    type: String,
    required: [true, "Please provide a prompt"],
  },
  choices: {
    type: [
      {
        type: ChoiceSchema,
        validate: {
          validator: (choice) => {
            return choice.id && choice.content;
          },
          message: "Each choice must follow the ChoiceSchema",
        },
      },
    ],
    required: [true, "Please provide choices"],
  },
  answers: {
    type: [String],
  },
});

const MCQ = mongoose.model("MCQ", MCQSchema);
export default MCQ;
