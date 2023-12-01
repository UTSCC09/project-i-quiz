import React, { useEffect } from "react";

const ClozeQuestion = (props) => {
  let textHTML = props.question.text;
  // if the not wrapped in a tag, wrap it with a <div>
  if (textHTML.endsWith("____")) {
    textHTML = "<div>" + textHTML + "</div>";
  }
  let textHTMLSplitted = textHTML.split("____");

  useEffect(() => {
    for (let i = 0; i < textHTMLSplitted.length - 1; i++) {
      const blank_input = document.querySelector(
        `#input-qid-${props.question.qid}-bid-${i}`
      );
      if (props.savedQuestionResponse) {
        blank_input.value = props.savedQuestionResponse[i] ?? "";
        blank_input.style.width = blank_input.value.length * 8 + 24 + "px";
      }
      blank_input.addEventListener("input", (e) => {
        e.target.style.width = e.target.value.length * 8 + 24 + "px";
      });
    }
  }, [props.updateQuestionResponse, textHTMLSplitted, props.savedQuestionResponse, props.question.qid]);

  let textHTMLString = textHTMLSplitted
    .map((textPart, bid) => {
      if (textHTMLSplitted.length - 1 === bid) {
        return textPart;
      }
      return `${textPart}<input
    name="${props.question.qid}"
    id="input-qid-${props.question.qid}-bid-${bid}"
    placeholder="${bid + 1}"
    class="max-w-sm min-w-[4rem] text-center mt-4 w-16 pt-0.5 mx-0.5 text-blue-700 border-b focus:border-blue-700 focus:outline-none"
    ></input>`;
    })
    .join("");

  return (
    <>
      <div className="mx-2">
        <div
          className="font-medium mb-2"
          dangerouslySetInnerHTML={{ __html: props.question.prompt }}
        ></div>
        <div
          id="textElement"
          dangerouslySetInnerHTML={{ __html: textHTMLString }}
        ></div>
      </div>
    </>
  );
};

export default ClozeQuestion;
