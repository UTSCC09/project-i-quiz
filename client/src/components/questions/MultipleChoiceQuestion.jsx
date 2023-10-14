import React from "react";
import RadioGroup from "../components/RadioGroup";

const MultipleChoiceQuestion = (props) => {
  return (
    <div className="flex flex-col">
      <span className="mb-6" dangerouslySetInnerHTML={{ __html: props.questionObject.prompt }}></span>
      <RadioGroup
        radioGroupId={props.questionObject.qid}
        radioOptions={props.questionObject.choices}
        defaultOptionId={props.savedAnswer[0]}
        autoSaveAnswers={props.autoSaveAnswers}
      />
    </div>
  )
}

export default MultipleChoiceQuestion;
