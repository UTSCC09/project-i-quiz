import React from "react";
import CheckBoxGroup from "components/elements/CheckBoxGroup";

export default function MultipleSelectQuestion(props) {
  return (
    <div className="flex flex-col">
      <span
        className="mb-6 mx-2"
        dangerouslySetInnerHTML={{ __html: props.question.prompt }}
      ></span>
      <CheckBoxGroup
        checkBoxGroupName={props.question._id}
        options={props.question.choices}
        checkedOptions={props.savedQuestionResponse}
        updateQuestionResponse={props.updateQuestionResponse}
        correctOptionIds={props.correctOptionIds}
      />
    </div>
  );
}
