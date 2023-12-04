import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionWrapper from "components/question_components/QuestionWrapper";
import NavBar from "components/page_components/NavBar";
import { getQuiz } from "api/QuizApi";
import {
  getQuizResponse,
  editQuizResponse,
  submitQuizResponse,
} from "api/QuizResponseApi";
import { useParams } from "react-router";
import { isStudentUserType } from "utils/CookieUtils";
import QuizResultPage from "./QuizResultPage";
import { Spinner } from "components/elements/SVGIcons";

const QuizPage = () => {
  const navigate = useNavigate();
  const isStudent = isStudentUserType();
  const { quizId } = useParams();

  let savedQuizResponse = useMemo(() => {
    return JSON.parse(localStorage.getItem("savedQuizResponse")) ?? {};
  }, []);

  const [quizObject, quizObjectSet] = useState();
  const [canEdit, setCanEdit] = useState(true);
  const [canSubmit, setCanSubmit] = useState(true);
  const [isLoading, isLoadingSet] = useState(false);

  const locallyStoreQuizResponse = useCallback(
    (questionResponses) => {
      questionResponses.forEach((questionResponse) => {
        savedQuizResponse[questionResponse.question] =
          questionResponse.response;
      });
      localStorage.setItem(
        "savedQuizResponse",
        JSON.stringify(savedQuizResponse)
      );
    },
    [savedQuizResponse]
  );

  const updateLocallyStoredQuestionResponse = (
    questionId,
    updatedQuestionResponse
  ) => {
    savedQuizResponse[questionId] = updatedQuestionResponse;
    localStorage.setItem(
      "savedQuizResponse",
      JSON.stringify(savedQuizResponse)
    );
  };

  const editQuizResponseInDb = () => {
    const editedQuestionResponses = [];
    Object.keys(savedQuizResponse).forEach((questionId) => {
      editedQuestionResponses.push({
        question: questionId,
        response: savedQuizResponse[questionId],
      });
    });

    setCanEdit(false);
    setCanSubmit(false);
    editQuizResponse(quizId, editedQuestionResponses)
      .then((payload) => {
        if (payload?.questionResponses) {
          console.log("Edited quiz response");
          setCanEdit(true);
          setCanSubmit(true);
        }
      })
      .catch((error) => {
        console.error("Frontend error editting quiz response:", error);
      });
  };

  const submitQuizResponseInDb = () => {
    isLoadingSet(true);
    setCanEdit(false);
    setCanSubmit(false);

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
          console.log("Edited quiz response before submitting");

          submitQuizResponse(quizId)
            .then((result) => {
              isLoadingSet(false);
              console.log("result in submit:", result);
              if (
                (!result.success &&
                  result.message === "Quiz grades not released yet") ||
                result.success
              ) {
                console.log("Submitted quiz response");
                navigate("/quiz-info/" + quizId);
              }
            })
            .catch((error) => {
              console.error("Frontend error submitting quiz response:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Frontend error editting quiz response:", error);
      });
  };

  useEffect(() => {
    getQuiz(quizId).then((quizPayload) => {
      if (isStudent) {
        getQuizResponse(quizId).then((result) => {
          console.log("result in get:", result);
          if (
            (!result.success &&
              result.message === "Quiz grades not released yet") ||
            (result.success &&
              result.payload.status === "submitted" &&
              result.payload.isGradeReleased === false)
          ) {
            navigate("/quiz-info/" + quizId);
            return;
          } else if (result.success) {
            locallyStoreQuizResponse(result.payload.questionResponses);
          } else if (!result.success) {
            console.error(result.message);
            return;
          }
          quizObjectSet(quizPayload);
        });
      }
    });

    return () => {
      localStorage.removeItem("savedQuizResponse");
    };
  }, [isStudent, locallyStoreQuizResponse, navigate, quizId, quizObjectSet]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen w-full flex justify-center py-28 sm:py-36 bg-gray-100">
        {quizObject &&
          (quizObject.isGradeReleased ? (
            <QuizResultPage />
          ) : (
            <form className="px-4 md:px-24 w-full lg:w-[64rem] flex flex-col gap-4 sm:gap-8 text-gray-800">
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
                        question={questionObject}
                        savedQuestionResponse={
                          savedQuizResponse[questionObject._id]
                        }
                        updateQuestionResponse={(
                          questionId,
                          updatedQuestionResponse
                        ) => {
                          updateLocallyStoredQuestionResponse(
                            questionId,
                            updatedQuestionResponse
                          );
                          editQuizResponseInDb();
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                className="btn-primary w-fit text-sm px-8 py-2 mt-2 place-self-end"
                style={{
                  pointerEvents: canSubmit ? "auto" : "none",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  submitQuizResponseInDb();
                }}
              >
                {isLoading ? <Spinner className="-mt-1" /> : "Submit"}
              </button>
            </form>
          ))}
      </div>
    </>
  );
};

export default QuizPage;
