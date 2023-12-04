import React from "react";
import RadioGroup from "components/elements/RadioGroup";

const MultipleChoiceQuestion = (props) => {
  return (
    <div className="flex flex-col">
      <span
        className="mb-6 mx-2"
        dangerouslySetInnerHTML={{ __html: props.question.prompt }}
      ></span>
      <RadioGroup
        radioGroupId={props.question._id}
        radioOptions={props.question.choices}
        defaultOptionId={props.savedQuestionResponse[0]}
        updateQuestionResponse={props.updateQuestionResponse}
        correctOptionId={props.correctOptionId}
      />
    </div>
  );
};

export default MultipleChoiceQuestion;
