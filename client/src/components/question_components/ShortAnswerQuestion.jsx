import React, { useState } from "react";

const ShortAnswerQuestion = (props) => {
  const [text, setText] = useState(props.savedQuestionResponse);

  const updateText = (e) => {
    e.preventDefault();
    setText(e.target.value);
    if (props.updateQuestionResponse)
      props.updateQuestionResponse(props.question._id, e.target.value);
  };

  return (
    <>
      <div
        className="mb-6 mx-2"
        dangerouslySetInnerHTML={{ __html: props.question.prompt }}
      ></div>
      <textarea
        className="h-24 px-4 py-2 w-full simple-input read-only:ring-0"
        name={props.question._id}
        maxLength={
          props.question.maxLength === 0 ? null : props.question.maxLength
        }
        readOnly={props.readOnly}
        defaultValue={text}
        onBlur={updateText}
      ></textarea>
    </>
  );
};

export default ShortAnswerQuestion;
