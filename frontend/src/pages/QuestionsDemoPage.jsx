import React, { useState } from "react";
import QuestionWrapper from "../components/QuestionWrapper";

const questions = [
  {
    "type": "MCQ",
    "image": null,
    "prompt": "<div>Which country has the largest area in the world?</div>",
    "choices": [
      {"id": "a", "content": "<div>Canada</div>"},
      {"id": "b", "content": "<div>United States</div>"},
      {"id": "c", "content": "<div>Russia</div>"},
      {"id": "d", "content": "<div>China</div>"}
    ],
    "answers": [["c"]]
  },
  {
    "type": "MCQ",
    "image": null,
    "prompt": "<div>Which of the following is not one of the three primary colors?</div>",
    "choices": [
        {"id": "a", "content": "<div style='color:green'>Green</div>"},
        {"id": "b", "content": "<div style='color:blue'>Blue</div>"},
        {"id": "c", "content": "<div style='color:red'>Red</div>"}
    ],
    "answers": [["a"]]
  },
  {
    "type": "SAQ",
    "image": null,
    "prompt": "<div>Describe your mood today!</div>",
    "maxLength": 180
  },
  {
    "type": "CLO",
    "prompt": "<div>Fill in the blanks.</div>",
    "text": "<ul><li>To be or not to be: that is the q____. <i>- William Shakespeare</i></li><li>Do not go g____ into that good night. <i>- Dylan Thomas</i></li><li>Genius is one percent i____ and ninety-nine percent perspiration. <i>- Thomas Edison</i></li></ul>",
    "answers": [
      {"bid": 0, "answer": "uestion"},
      {"bid": 1, "answer": "entle"},
      {"bid": 2, "answer": "nspiration"}
    ]
  },
  {
    "type": "CLO",
    "prompt": "<div>Fill in the blanks.</div>",
    "text": "<div>What is your favorite food? ____</div>",
    "answers": [[]]
  }
];

const QuestionsDemoPage = () => {
  let studentAnswers = {};

  for (let qid in questions) {
    questions[qid]["qid"] = qid;
  }

  function answerChangeHandler (qid, newAnswer) {
    studentAnswers[qid] = newAnswer;
    console.log("studentAnswers:", studentAnswers);
  }

  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center">
        {questions.map((questionObj) => {
          return (
            <div
              className="h-fit w-[60vw] m-12 flex flex-col border-gray-200 shadow-xl shadow-gray-150 rounded-lg px-16 py-16"
              key={questionObj.qid}
            >
              <QuestionWrapper
                questionObject={questionObj}
                onAnswerChange={answerChangeHandler}
              />
            </div>
          );
        })}
        <div className="w-[60vw] flex justify-end">
          <button className="mt-12 btn-primary py-8 w-48 font-bold text-lg uppercase rounded-md" onClick={(e) => {alert(JSON.stringify(studentAnswers))}}>Review & Submit</button>
        </div>
        <footer className="py-32">Footer</footer>
      </div>
    </>
  );
};

export default QuestionsDemoPage;
