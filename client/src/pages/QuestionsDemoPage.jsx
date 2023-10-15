import React, { useEffect } from "react";
import colors from 'tailwindcss/colors'
import QuestionWrapper from "../components/QuestionWrapper";
import MockQuizObject from "../mock_data/QuizMock1.json"

const mockQuizObject = MockQuizObject;

const QuestionsDemoPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = colors.gray[100];
  })

  let savedAnswers = JSON.parse(localStorage.getItem("savedAnswers")) ?? {};

  console.log("Fetched saved aswers from LocalStorage:", savedAnswers);

  mockQuizObject.questions.forEach((questionObj) => {
    savedAnswers[questionObj.qid] = savedAnswers[questionObj.qid] ?? [];
  });

  function autoSaveAnswers() {
    savedAnswers = {}
    const formData = new FormData(document.querySelector("form"));
    formData.forEach((value, key) => {
      if (!savedAnswers[key]) savedAnswers[key] = [];
      savedAnswers[key].push(value);
    });
    localStorage.setItem("savedAnswers", JSON.stringify(savedAnswers));
  }

  return (
    <>
      <form>
        <div className="w-screen flex justify-center">
          <div className="w-[80vw] lg:w-[48rem] flex flex-col items-center">
            {
              mockQuizObject.questions.map((questionObj, idx) => {
                return (
                  <div
                    className="h-fit w-full m-5 flex flex-col border drop-shadow-sm bg-white shadow-gray-150 rounded-md py-12"
                    key={questionObj.qid}
                  >
                    <span className="font-bold text-sm uppercase ml-12 text-gray-500 mb-4">
                      Question {idx + 1} / {mockQuizObject.questions.length}
                    </span>
                    <div className="border-b h-0 mb-6 mx-10"></div>
                    <div className="mx-12">
                      <QuestionWrapper
                        questionObject={questionObj}
                        savedAnswer={savedAnswers[idx]}
                        autoSaveAnswers={autoSaveAnswers}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </form>
    </>
  );
};

export default QuestionsDemoPage;
