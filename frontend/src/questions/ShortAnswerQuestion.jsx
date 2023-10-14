import React from "react";

const ShortAnswerQuestion = ({ questionObject, savedAnswer, onAnswerChange }) => {
  return (
    <>
      <div className="mb-6" dangerouslySetInnerHTML={{ __html: questionObject.prompt }}></div>
      <textarea
        className="h-24 px-4 py-2 w-full rounded-md border border-gray-200"
        name={questionObject.qid}
        maxLength={questionObject.maxLength}
        defaultValue={savedAnswer}
        onChange={onAnswerChange}
      ></textarea>
    </>
  )
}

export default ShortAnswerQuestion;
