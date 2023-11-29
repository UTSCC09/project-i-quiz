import React, { useEffect, useState } from "react";
import QuestionWrapper from "components/question_components/QuestionWrapper";
import NavBar from "components/page_components/NavBar";
import { getQuiz } from "api/QuizApi";
import { getQuizResponse, editQuizResponse } from "api/QuizResponseApi";
import { useParams } from "react-router";
import { isStudentUserType } from "utils/CookieUtils";

const QuizPage = () => {
  const isStudent = isStudentUserType();
  const { quizId } = useParams();
  const [quizObject, quizObjectSet] = useState();
  let savedQuizResponse = JSON.parse(localStorage.getItem("savedQuizResponse")) ?? {};
  const [intervalId, setIntervalId] = useState();

  const setSavedQuizResponse = (questionResponses) => {
    questionResponses.forEach((questionResponse) => {
      savedQuizResponse[questionResponse.question] = questionResponse.response;
    });
    localStorage.setItem("savedQuizResponse", JSON.stringify(savedQuizResponse));
  };

  const saveUpdateQuestionResponse = (questionId, updatedQuestionResponse) => {
    savedQuizResponse[questionId] = updatedQuestionResponse;
    localStorage.setItem("savedQuizResponse", JSON.stringify(savedQuizResponse));
  };

  const editQuizResponseInDb = () => {  
    const editedQuestionResponses = [];
    Object.keys(savedQuizResponse).forEach((questionId) => {
      editedQuestionResponses.push({
        question: questionId,
        response: savedQuizResponse[questionId],
      });
    });

    editQuizResponse(quizId, editedQuestionResponses)
      .then((payload) => {
        if (payload?.questionResponses) {
          setSavedQuizResponse(payload.questionResponses);
          console.log("Saved quiz response to server");
        }
      })
      .catch((error) => {
        console.error("Error submitting quiz response:", error);
      });
  };

  useEffect(() => {
    getQuiz(quizId).then((quizPayload) => {
      if (isStudent) {
        getQuizResponse(quizId).then((result) => {
          if (result?.payload?.questionResponses) {
            setSavedQuizResponse(result.payload.questionResponses);
          }
          quizObjectSet(quizPayload);
        });
      }
    });
  
    /* const interval = setInterval(intervalFunction, 0.5 * 60 * 1000);
    setIntervalId(interval); */

    return () => {
      localStorage.removeItem("savedQuizResponse");
      /* clearInterval(intervalId); */
    };
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
            {quizObject.questions.map((questionObject, idx) => {
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
                      questionType={questionObject.type}
                      question={questionObject.question}
                      savedQuestionResponse={savedQuizResponse[questionObject.question._id]}
                      updateQuestionResponse={saveUpdateQuestionResponse}
                    />
                  </div>
                </div>
              );
            })}
            <button
              className="btn-primary w-fit text-sm px-8 py-2 mt-2 place-self-end"
              onClick={editQuizResponseInDb}
            >
              Save
            </button>
            <button
              type="submit"
              className="btn-primary w-fit text-sm px-8 py-2 mt-2 place-self-end"
              onClick={() => console.log("Response submitted")}
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
