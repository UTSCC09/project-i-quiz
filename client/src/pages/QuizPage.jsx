import React from "react";
import QuestionWrapper from "components/questions/QuestionWrapper";
import QuizMock from "mock_data/QuizPage/QuizMock_1.json"
import NavBar from "components/page_components/NavBar";

const QuizPage = () => {
  let savedAnswers = JSON.parse(localStorage.getItem("savedAnswers")) ?? {};

  console.log("Fetched saved aswers from LocalStorage:", savedAnswers);

  QuizMock.questions.forEach((questionObj) => {
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
      <NavBar />
      <form>
        <div className="w-screen flex justify-center py-36 bg-gray-100">
          <div className="w-full px-4 md:w-[48rem] flex flex-col items-center">
            {
              QuizMock.questions.map((questionObj, idx) => {
                return (
                  <div
                    className="h-fit w-full my-4 flex flex-col md:border drop-shadow-sm bg-white shadow-gray-150 rounded-md py-12"
                    key={questionObj.qid}
                  >
                    <span className="font-bold text-sm uppercase ml-12 text-gray-500 mb-4">
                      Question {idx + 1} / {QuizMock.questions.length}
                    </span>
                    <div className="border-b h-0 mb-6 mx-10"></div>
                    <div className="mx-10">
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

export default QuizPage;
