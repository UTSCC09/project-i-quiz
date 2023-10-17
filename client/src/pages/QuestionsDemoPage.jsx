import React, { useEffect } from "react";
import colors from 'tailwindcss/colors'
import QuestionWrapper from "components/questions/QuestionWrapper";

const questions = [
  {
    "qid": 0,
    "type": "MCQ",
    "image": null,
    "prompt": "<div>Which country has the largest area in the world?</div>",
    "choices": [
      { "id": "a", "content": "<div>Canada</div>" },
      { "id": "b", "content": "<div>United States</div>" },
      { "id": "c", "content": "<div>Russia</div>" },
      { "id": "d", "content": "<div>China</div>" }
    ],
    "answers": "c"
  },
  {
    "qid": 1,
    "type": "MCQ",
    "image": null,
    "prompt": "<div>Which of the following is not one of the three primary colors?</div>",
    "choices": [
      { "id": "a", "content": "<div style='color:green'>Green</div>" },
      { "id": "b", "content": "<div style='color:blue'>Blue</div>" },
      { "id": "c", "content": "<div style='color:red'>Red</div>" }
    ],
    "answers": "a"
  },
  {
    "qid": 2,
    "type": "SAQ",
    "image": null,
    "prompt": "<div>What is the meaning of the French word \"travailler\"?</div>",
    "maxLength": 180,
    "answers": "work"
  },
  {
    "qid": 3,
    "type": "CLO",
    "prompt": "<div>Fill in the blanks.</div>",
    "text": "<ul><li>To be or not to be: that is the q____. <i>- William Shakespeare</i></li><li>Do not go g____ into that good night. <i>- Dylan Thomas</i></li><li>Genius is one percent i____ and ninety-nine percent perspiration. <i>- Thomas Edison</i></li></ul>",
    "answers": {
      "0": "uestion",
      "1": "entle",
      "2": "nspiration"
    }
  },
  {
    "qid": 4,
    "type": "CLO",
    "prompt": "<div>Fill in the blanks.</div>",
    "text": "<div>What is your favorite food? ____</div>",
    "answers": null
  }
];

const QuestionsDemoPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = colors.gray[100];
  })
  let studentAnswers = JSON.parse(localStorage.getItem("studentAnswers")) ?? {};

  questions.forEach((questionObj) => {
    studentAnswers[questionObj.qid] = studentAnswers[questionObj.qid] ?? [];
  });

  function answerChange() {
    const formData = new FormData(document.querySelector("form"));
    let dct = {};
    formData.forEach((value, key) => {
      if (!dct[key]) dct[key] = [];
      dct[key].push(value);
    });
    console.log(dct)
    localStorage.setItem("studentAnswers", JSON.stringify(dct));
  }

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    let dct = {};
    data.forEach((value, key) => {
      if (!dct[key]) dct[key] = [];
      dct[key].push(value);
    });
    console.log(dct)
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="w-screen flex flex-col items-center">
          <div className="w-[80vw] lg:w-[48rem] flex flex-col items-center">
            {
              questions.map((questionObj, idx) => {
                return (
                  <div
                    className="h-fit w-full m-12 flex flex-col border drop-shadow-sm bg-white shadow-gray-150 rounded-lg py-12"
                    key={questionObj.qid}
                  >
                    <span className="font-bold uppercase ml-12 text-iquiz-blue mb-4">Question {Number(questionObj.qid) + 1}</span>
                    <div className="border-b h-0 mb-6 mx-10"></div>
                    <div className="mx-12">
                      <QuestionWrapper
                        questionObject={questionObj}
                        savedAnswer={studentAnswers[idx]}
                        onAnswerChange={answerChange}
                      />
                    </div>
                  </div>
                );
              })}
            <div className="w-full flex justify-end mb-48">
              <button className="mt-6 btn-primary py-4 w-36 rounded-md" type="submit" onClick={(e) => {
                // let answerCheckResult = {};
                // questions.forEach((questionObj, idx) => {
                //   if (!questionObj.answers) {
                //     answerCheckResult[idx] = "OPEN-ENDED";
                //   }
                //   else if (JSON.stringify(questionObj.answers) !== JSON.stringify(studentAnswers[idx])) {
                //     answerCheckResult[idx] = false;
                //     console.log("Your answer for question", idx+1, "\"", studentAnswers[idx],  "\"is different from the answer \"", questionObj.answers, "\"");
                //   }
                //   else {
                //     answerCheckResult[idx] = true;
                //   }
                // })
                // alert(JSON.stringify(answerCheckResult));
              }}>Review & Submit</button>
            </div>
          </div>
        </div></form>
    </>
  );
};

export default QuestionsDemoPage;
