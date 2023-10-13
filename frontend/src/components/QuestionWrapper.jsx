import React from "react";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import ShortAnswerQuestion from "../questions/ShortAnswerQuestion";
import ClozeQuestion from "../questions/ClozeQuestion";

const QuestionWrapper = (props) => {
  console.log(1, props)
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

  return (
  <>
  <div className="flex flex-col">
    <span className="font-bold text-lg text-blue-800 mb-4">Question {Number(props.questionObject.qid) + 1}</span>
    {questionElmt}
  </div>
  </>
  );
}

export default QuestionWrapper;
