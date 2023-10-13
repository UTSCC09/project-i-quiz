import React, { useEffect } from "react";
import { useState } from "react";
import RadioGroup from "../components/RadioGroup";

const MultipleChoiceQuestion = ({questionObject, savedAnswer, onAnswerChange}) => {
  const [selectedOptionId, setselectedOptionId] = useState(-1);

  useEffect(() => {
    if (savedAnswer) setselectedOptionId(savedAnswer);
  }, [savedAnswer, setselectedOptionId])

  function onOptionChangeHandler (optionId) {
    setselectedOptionId(optionId);
    onAnswerChange(questionObject.qid, optionId);
  }
  const radioGroup = 
  (<RadioGroup radioGroupId={questionObject.qid} radioOptions={questionObject.choices} onOptionChangeHandler={onOptionChangeHandler} selectedOptionId={selectedOptionId} />);

  return (
    <div className="flex flex-col">
      <span className="mb-6" dangerouslySetInnerHTML={{__html: questionObject.prompt}}></span>
      {radioGroup}
    </div>
  )
}

export default MultipleChoiceQuestion;
