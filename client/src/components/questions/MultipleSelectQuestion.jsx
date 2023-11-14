import React from "react";
import CheckBoxGroup from "components/elements/CheckBoxGroup";

export default function MultipleSelectQuestion(props) {
  return (
    <div className="flex flex-col">
      <span
        className="mb-6 mx-2"
        dangerouslySetInnerHTML={{ __html: props.questionObject.prompt }}
      ></span>
      <CheckBoxGroup
        checkBoxGroupName={props.questionObject.qid}
        options={props.questionObject.choices}
        checkedOptions={props.savedAnswer}
        autoSaveAnswers={props.autoSaveAnswers}
      />
    </div>
  );
}
