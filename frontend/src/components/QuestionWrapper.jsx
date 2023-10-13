import React from "react";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import ShortAnswerQuestion from "../questions/ShortAnswerQuestion";
import ClozeQuestion from "../questions/ClozeQuestion";

const QuestionWrapper = (props) => {
  let questionElmt;
  switch (props.questionObject.type) {
    case "MCQ":
      questionElmt = (
        <MultipleChoiceQuestion
          questionObject={props.questionObject}
          savedAnswer={props.savedAnswer}
          onAnswerChange={props.onAnswerChange}
        />
      )
      break;
    case "SAQ":
      questionElmt = (
        <ShortAnswerQuestion
        questionObject={props.questionObject}
        savedAnswer={props.savedAnswer}
        onAnswerChange={props.onAnswerChange}
      />
      )
      break;
    case "CLO":
      questionElmt = (
        <ClozeQuestion
        questionObject={props.questionObject}
        savedAnswer={props.savedAnswer}
        onAnswerChange={props.onAnswerChange}
      />
      )
      break;
    default:
      questionElmt=(
        <div>Unexpected question type: "{props.questionObject.type}"</div>
      )
  }

  return <div className="w-full">{questionElmt}</div>;
}

export default QuestionWrapper;
