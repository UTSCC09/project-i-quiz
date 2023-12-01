import React, { useState } from "react";

const ShortAnswerQuestion = (props) => {
  const [text, setText] = useState(props.savedQuestionResponse);

  const updateText = (e) => {
    e.preventDefault();
    setText(e.target.value);
    props.updateQuestionResponse(props.question._id, e.target.value);
  };

  return (
    <>
      <div
        className="mb-6 mx-2"
        dangerouslySetInnerHTML={{ __html: props.question.prompt }}
      ></div>
      <textarea
        className="h-24 px-4 py-2 w-full rounded-md border border-gray-200"
        name={props.question._id}
        maxLength={props.question.maxLength}
        defaultValue={text}
        onBlur={updateText}
      ></textarea>
    </>
  );
};

export default ShortAnswerQuestion;
