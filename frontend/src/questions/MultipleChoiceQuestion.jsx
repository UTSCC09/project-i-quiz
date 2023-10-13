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
    <>
      <span className="font-medium text-lg mb-8" dangerouslySetInnerHTML={{__html: questionObject.prompt}}></span>
      {radioGroup}
    </>
  )
}

export default MultipleChoiceQuestion;
