import React from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import ClozeQuestion from "./ClozeQuestion";

const QuestionWrapper = (props) => {
  let questionElmt;
  switch (props.questionObject.type) {
    case "MCQ":
      questionElmt = (
        <MultipleChoiceQuestion {...props} />
      )
      break;
    case "SAQ":
      questionElmt = (
        <ShortAnswerQuestion {...props} />
      )
      break;
    case "CLO":
      questionElmt = (
        <ClozeQuestion {...props} />
      )
      break;
    default:
      questionElmt = (
        <div>Unexpected question type: "{props.questionObject.type}"</div>
      )
  }

  return <div className="w-full">{questionElmt}</div>;
}

export default QuestionWrapper;
