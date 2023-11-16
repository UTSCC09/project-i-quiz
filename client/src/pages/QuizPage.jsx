import React, { useEffect, useState } from "react";
import QuestionWrapper from "components/questions/QuestionWrapper";
import QuizMock from "mock_data/QuizPage/QuizMock_1.json";
import NavBar from "components/page_components/NavBar";
import { getQuiz } from "api/QuizApi";
import { useParams } from "react-router";

const QuizPage = () => {
  let savedAnswers = JSON.parse(localStorage.getItem("savedAnswers")) ?? {};
  const { quizId } = useParams();
  const [quizObject, quizObjectSet] = useState();

  // console.log("Fetched saved aswers from LocalStorage:", savedAnswers);

  QuizMock.questions.forEach((questionObj) => {
    savedAnswers[questionObj.qid] = savedAnswers[questionObj.qid] ?? [];
  });

  function autoSaveAnswers() {
    savedAnswers = {};
    const formData = new FormData(document.querySelector("form"));
    formData.forEach((value, key) => {
      if (!savedAnswers[key]) savedAnswers[key] = [];
      savedAnswers[key].push(value);
    });
    localStorage.setItem("savedAnswers", JSON.stringify(savedAnswers));
  }

  useEffect(() => {
    getQuiz(quizId).then((payload) => {
      quizObjectSet(payload);
    });
  }, [quizId, quizObjectSet]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen w-full flex justify-center py-28 sm:py-36 bg-gray-100">
        {quizObject && (
          <form
            className="px-4 md:px-24 w-full lg:w-[64rem] flex flex-col gap-4 sm:gap-8 text-gray-800"
            onSubmit={(e) => {
              e.preventDefault();
              /* TODO: make submit quiz API call */
            }}
          >
            {quizObject.questions.map((questionObj, idx) => {
              return (
                <div
                  className="h-fit w-full flex flex-col shadow-sm bg-white rounded-md py-8 md:py-12 px-8 sm:px-12 lg:px-16 border"
                  key={idx}
                >
                  <span className="font-semibold text-xs uppercase ml-2 text-gray-500 mb-4">
                    Question {idx + 1} / {quizObject.questions.length}
                  </span>
                  <div className="border-b h-0 mb-6"></div>
                  <div className="">
                    <QuestionWrapper
                      questionType={questionObj.type}
                      questionObject={questionObj.question}
                      savedAnswer={savedAnswers[idx]}
                      autoSaveAnswers={autoSaveAnswers}
                    />
                  </div>
                </div>
              );
            })}
            <button
              className="btn-primary w-fit text-sm px-8 py-2 mt-2 place-self-end"
              onClick={() => console.log(JSON.stringify(savedAnswers))}
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default QuizPage;
