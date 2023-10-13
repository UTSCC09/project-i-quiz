import React, { useEffect } from "react";

const ClozeQuestion = ({ questionObject, savedAnswer, onAnswerChange }) => {
  let textHTML = questionObject.text;
  // if the not wrapped in a tag, wrap it with a <div>
  if (textHTML.endsWith("____")) {
    textHTML = "<div>" + textHTML + "</div>";
  }
  let textHTMLSplitted = textHTML.split("____");
  let newAnswer = savedAnswer;

  useEffect(() => {
    for (let i = 0; i < textHTMLSplitted.length-1; i++) {
      const blank_input = document.querySelector(`#input-qid-${questionObject.qid}-bid-${i}`);
      if (savedAnswer) {
        blank_input.value = savedAnswer[i] ?? "";
      }
      blank_input
        .addEventListener("input", (e) => {
          newAnswer[i] = (e.target.value);
          onAnswerChange(questionObject.qid, newAnswer);
          console.log(e.target.style.width)
          e.target.style.width = (e.target.value.length * 8 + 24) + "px";
        });
    }
  }, [onAnswerChange, textHTMLSplitted, newAnswer, questionObject.qid]);

  let textHTMLString = textHTMLSplitted.map((textPart, bid) => {
    if (textHTMLSplitted.length - 1 === bid) {
      return textPart;
    }
    return `${textPart}<input
    id="input-qid-${questionObject.qid}-bid-${bid}"
    placeholder="${bid+1}"
    class="max-w-sm min-w-[4rem] text-center mt-4 w-16 px-1 py-0.5 mx-0.5 text-blue-800 border rounded-md"
    ></input>`
  }).join("");

  return (
    <>
      <div>
        <div className="font-medium mb-2" dangerouslySetInnerHTML={{ __html: questionObject.prompt }}></div>
        <div id="textElement" dangerouslySetInnerHTML={{ __html:  textHTMLString}}></div>
      </div>
    </>
  );
}

export default ClozeQuestion;
