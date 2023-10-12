import React from "react";
import { useState } from "react";
import RadioGroup from "../components/RadioGroup";

const MultipleChoiceQuestion = ({questionObject, onAnswerChange}) => {
  const [selectedOptionId, setselectedOptionId] = useState(-1);
  function onOptionChangeHandler (optionId) {
    setselectedOptionId(optionId);
    onAnswerChange(questionObject.qid, optionId);
  }
  const radioGroup = 
  (<RadioGroup radioGroupId={questionObject.qid} radioOptions={questionObject.choices} onOptionChangeHandler={onOptionChangeHandler} selectedOptionId={selectedOptionId} />);

  return (
    <>
      <span className="font-medium text-lg mb-8" dangerouslySetInnerHTML={{__html: questionObject.prompt}}></span>
      {radioGroup}
    </>
  )
}

export default MultipleChoiceQuestion;
