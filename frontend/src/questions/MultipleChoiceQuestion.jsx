import React, { useEffect } from "react";
import { useState } from "react";
import RadioGroup from "../components/RadioGroup";

const MultipleChoiceQuestion = (props) => {
  const [selectedOptionId, setSelectedOptionId] = useState(-1);

  useEffect(() => {
    if (props.savedAnswer) setSelectedOptionId(props.savedAnswer[0]);
  }, [props.savedAnswer, props.setSelectedOptionId]);

  function onOptionChange(optionId) {
    props.setSelectedOptionId(optionId);
    props.onAnswerChange();
  }

  return (
    <div className="flex flex-col">
      <span className="mb-6" dangerouslySetInnerHTML={{ __html: props.questionObject.prompt }}></span>
      <RadioGroup radioGroupId={props.questionObject.qid} radioOptions={props.questionObject.choices} onOptionChange={onOptionChange} selectedOptionId={props.selectedOptionId} />
    </div>
  )
}

export default MultipleChoiceQuestion;
