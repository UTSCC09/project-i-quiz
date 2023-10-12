import React from "react";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import ShortAnswerQuestion from "../questions/ShortAnswerQuestion";
import ClozeQuestion from "../questions/ClozeQuestion";

const QuestionWrapper = ({questionObject, onAnswerChange}) => {
  let questionElmt;
  switch (questionObject.type) {
    case "MCQ":
      questionElmt = (
        <MultipleChoiceQuestion questionObject={questionObject} onAnswerChange={onAnswerChange} />
      )
      break;
    case "SAQ":
      questionElmt = (
        <ShortAnswerQuestion questionObject={questionObject} onAnswerChange={onAnswerChange} />
      )
      break;
    case "CLO":
      questionElmt = (
        <ClozeQuestion questionObject={questionObject} onAnswerChange={onAnswerChange} />
      )
      break;
    default:
      questionElmt=(
        <div>Unexpected question type: "{questionObject.type}"</div>
      )
  }

  return (
  <>
  <div className="flex flex-col">
    <span className="font-bold text-lg text-blue-800 mb-4">Question {Number(questionObject.qid) + 1}</span>
    {questionElmt}
  </div>
  </>
  );
}

export default QuestionWrapper;
