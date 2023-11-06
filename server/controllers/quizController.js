import asyncHandler from "express-async-handler";
import Quiz from "../models/Quiz.js";
import MCQ from "../models/MCQ.js";
import MSQ from "../models/MSQ.js";
import CLO from "../models/CLO.js";
import OEQ from "../models/OEQ.js";
import User from "../models/User.js";

import formatMessage from "../utils/utils.js";

//@route  POST api/quizzes
//@desc   Allow instructor to create a quiz
//@access Private
const createQuiz = asyncHandler(async (req, res) => {
  const { quizName, startTime, endTime, course, questions } = req.body;

  //Check if valid user
  try {
    const instructor = await User.findOne({ email: req.session.email });
    if (!instructor) {
      return res.status(400).json(formatMessage(false, "Invalid user"));
    }
    else if (instructor.type !== "instructor") {
      return res.status(400).json(formatMessage(false, "Invalid user type"));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Invalid id"));
  }

  //Verify all fields exist
  if (!quizName || !startTime || !endTime || !course || !questions) {
    return res.status(400).json(formatMessage(false, "Missing fields"));
  }

  //Convert startTime and endTime to Date objects
  const startTimeConverted = new Date(startTime);
  const endTimeConverted = new Date(endTime);

  //Verify startTime and endTime are valid dates and startTime is before endTime
  if (isNaN(startTimeConverted) || isNaN(endTimeConverted) || startTime >= endTime) {
    return res.status(400).json(formatMessage(false, "Invalid start and/or end time"));
  }

  //Check if there is a pre-existing quiz
  try {
    const existingQuiz = await Quiz.findOne(
      {$and: [
        { quizName: quizName },
        { course: course }
      ]});
    if (existingQuiz) {
      return res.status(400).json(formatMessage(false, "Quiz already exists"));
    }
  } catch (error) {
    return res.status(400).json(formatMessage(false, "Invalid course id"));
  }

  //Quiz questions
  const quizQuestions = [];

  //Create questions
  for (let i = 0; i < questions.length; i++) {
    let createdQuestion;
    switch(questions[i].type) {
      case "MCQ":
        const validMCQChoices = questions[i].question.choices.every((choice) => choice.id && choice.content);
        if (!validMCQChoices) {
          return res.status(400).json(formatMessage(false, "Invalid choices in MCQ question"));
        }
        createdQuestion = await MCQ.create(questions[i].question);
        break;
      case "MSQ":
        const validMSQChoices = questions[i].question.choices.every((choice) => choice.id && choice.content);
        if (!validMSQChoices) {
          return res.status(400).json(formatMessage(false, "Invalid choices in MSQ question"));
        }
        createdQuestion = await MSQ.create(questions[i].question);
        break;
      case "CLO":
        createdQuestion = await CLO.create(questions[i].question);
        break;
      case "OEQ":
        createdQuestion = await OEQ.create(questions[i].question);
        break;
      default:
        return res.status(400).json(formatMessage(false, "Invalid question type"));
    }

    if (!createdQuestion) {
      return res.status(400).json(formatMessage(false, "Question creation failed"));
    }
    else {
      quizQuestions.push({
        question: createdQuestion._id,
        type: questions[i].type
      });
    }
  }

  //Create quiz
  const quiz = await Quiz.create({
    quizName: quizName,
    startTime: startTimeConverted,
    endTime: endTimeConverted,
    course: course,
    questions: quizQuestions
  });
  if (quiz) {
    return res.status(200).json(formatMessage(true, "Quiz created successfully"));
  }
  else {
    return res.status(400).json(formatMessage(false, "Quiz creation failed"));
  }
});

// ------------------------------ Promise functions --------------------------------

export {
  createQuiz
};