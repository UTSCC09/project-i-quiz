import React, { useEffect, useState } from "react";
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
        defaultOptionId={
          props.savedQuestionResponse && props.savedQuestionResponse[0]
        }
        updateQuestionResponse={props.updateQuestionResponse}
        correctOptionId={props.correctOptionIds && props.correctOptionIds[0]}
      />
    </div>
  );
};

export default MultipleChoiceQuestion;
