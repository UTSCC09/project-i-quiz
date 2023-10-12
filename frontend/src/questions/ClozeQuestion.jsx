import React, { useEffect } from "react";

const ClozeQuestion = ({ questionObject, onAnswerChange }) => {
  let textHTMLSplitted = questionObject.text.split("____");
  let newAnswer = {};

  useEffect(() => {
    for (let i = 0; i < textHTMLSplitted.length-1; i++) {
      document.querySelector(`#input-qid-${questionObject.qid}-bid-${i}`)
      .addEventListener("input", (e) => {
        newAnswer[i] = (e.target.value);
        onAnswerChange(questionObject.qid, newAnswer);
        console.log(e.target.style.width)
        e.target.style.width = (e.target.value.length * 8 + 24) + "px";
      });
    }
  }, [onAnswerChange, textHTMLSplitted, newAnswer]);

  let textHTMLString = textHTMLSplitted.map((textPart, bid) => {
    if (textHTMLSplitted.length - 1 === bid) {
      return textPart;
    }
    return `${textPart}<input
    id="input-qid-${questionObject.qid}-bid-${bid}"
    placeholder="${bid+1}"
    class="max-w-sm min-w-[4rem] text-center mt-4 w-16 px-1 mx-0.5 text-blue-800 border rounded-md"
    ></input>`
  }).join("");

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="font-medium text-lg" dangerouslySetInnerHTML={{ __html: questionObject.prompt }}></div>
        <div id="textElement" dangerouslySetInnerHTML={{ __html:  textHTMLString}}></div>
      </div>
    </>
  );
}

export default ClozeQuestion;
