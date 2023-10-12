import React from "react";

const ShortAnswerQuestion = ({questionObject, onAnswerChange}) => {
  return (
    <>
      <div className="text-lg mb-4" dangerouslySetInnerHTML={{__html: questionObject.prompt}}></div>
      <textarea
        className="h-24 px-4 py-2 rounded-md border border-gray-200"
        maxLength={questionObject.maxLength}
        onChange={(e) => onAnswerChange(questionObject.qid, e.target.value) }
      ></textarea>
    </>
  )
}

export default ShortAnswerQuestion;
