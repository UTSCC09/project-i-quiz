import React from "react";
import MultipleChoiceQuestion from "../questions/MultipleChoiceQuestion";
import ShortAnswerQuestion from "../questions/ShortAnswerQuestion";
import ClozeQuestion from "../questions/ClozeQuestion";
import MultipleSelectQuestion from "../questions/MultipleSelectQuestion";

const QuestionWrapper = (props) => {
  let questionElmt;
  switch (props.questionType) {
    case "MCQ":
      questionElmt = <MultipleChoiceQuestion {...props} />;
      break;
    case "MSQ":
      questionElmt = <MultipleSelectQuestion {...props} />;
      break;
    case "OEQ":
      questionElmt = <ShortAnswerQuestion {...props} />;
      break;
    case "CLO":
      questionElmt = <ClozeQuestion {...props} />;
      break;
    default:
      questionElmt = (
        <div>Unexpected question type: "{props.questionType}"</div>
      );
  }

  return <div className="w-full">{questionElmt}</div>;
};

export default QuestionWrapper;
