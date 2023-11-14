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
      <div className="min-h-screen w-full flex justify-center py-24 md:py-36 bg-gray-100">
        {quizObject && (
          <form>
            <div className="w-full px-4 md:w-[48rem] flex flex-col items-center text-gray-800">
              {quizObject.questions.map((questionObj, idx) => {
                return (
                  <div
                    className="h-fit w-full my-4 flex flex-col shadow-sm bg-white rounded py-12"
                    key={idx}
                  >
                    <span className="font-semibold text-xs uppercase ml-12 text-gray-500 mb-4">
                      Question {idx + 1} / {quizObject.questions.length}
                    </span>
                    <div className="border-b h-0 mb-6 mx-10"></div>
                    <div className="mx-10">
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
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default QuizPage;
