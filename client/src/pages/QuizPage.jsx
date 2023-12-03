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

const QuizPage = () => {
  const isStudent = isStudentUserType();
  const { quizId } = useParams();
  const [quizObject, quizObjectSet] = useState();
  let savedQuizResponse = useMemo(() => {
    return JSON.parse(localStorage.getItem("savedQuizResponse")) ?? {};
  }, []);
  const [canEdit, setCanEdit] = useState(true);
  const [canSubmit, setCanSubmit] = useState(true);
  const navigate = useNavigate();

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
          locallyStoreQuizResponse(payload.questionResponses);
        }
      })
      .catch((error) => {
        console.error("Frontend error editting quiz response:", error);
      });
  };

  const submitQuizResponseInDb = () => {
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
          locallyStoreQuizResponse(payload.questionResponses);

          submitQuizResponse(quizId)
            .then((resultSuccess) => {
              if (resultSuccess) {
                console.log("Submitted quiz response");
                setCanEdit(true);
                setCanSubmit(true);
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
          if (
            !result.success ||
            !result.payload ||
            !result.payload.questionResponses
          ) {
            navigate("/quiz-info/" + quizId);
            console.error(result.message);
            return;
          }
          if (result.payload.status === "submitted") {
            navigate("/quiz-info/" + quizId);
            return;
          }
          locallyStoreQuizResponse(result.payload.questionResponses);
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
        {quizObject && (
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
              className="btn-primary w-fit text-sm px-8 py-2 mt-2 place-self-end"
              type="button"
              style={{
                pointerEvents: canEdit ? "auto" : "none",
              }}
              onClick={editQuizResponseInDb}
            >
              Save
            </button>
            <button
              type="submit"
              className="btn-primary w-fit text-sm px-8 py-2 mt-2 place-self-end"
              style={{
                pointerEvents: canSubmit ? "auto" : "none",
              }}
              onClick={submitQuizResponseInDb}
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
