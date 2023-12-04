import { getQuiz } from "api/QuizApi";
import { createQuizRemark, getRemarkInfoForStudent } from "api/QuizRemarkApi";
import { getQuizResponse } from "api/QuizResponseApi";
import AlertBanner from "components/elements/AlertBanner";
import Modal from "components/elements/Modal";
import { Spinner } from "components/elements/SVGIcons";
import Toast from "components/elements/Toast";
import QuestionWrapper from "components/question_components/QuestionWrapper";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QuizResultPage() {
  const quizId = "656a3611e965cc1aa8f42abf";
  const navigate = useNavigate();
  const [quizObject, quizObjectSet] = useState();
  const [questionResponses, questionResponsesSet] = useState();
  const [regradeModalShow, regradeModalShowSet] = useState(false);
  const [isLoading, isLoadingSet] = useState(false);
  const [toastMessage, toastMessageSet] = useState();
  const [questionNumForRegrade, questionNumForRegradeSet] = useState(0);
  const alertRef = useRef();
  const questionIdForRegradeRef = useRef();
  const studentCommentRef = useRef();

  useEffect(() => {
    getQuiz(quizId).then((quizPayload) => {
      quizObjectSet(quizPayload);
      getQuizResponse(quizId).then((result) => {
        if (result.success && result.payload.graded === "not") {
          navigate("/quiz-info/" + quizId);
          return;
        } else if (result.success) {
          result.payload.questionResponses.forEach(
            (questionResponsePayload) => {
              questionResponsesSet((prev) => {
                return {
                  ...prev,
                  [questionResponsePayload.question]: {
                    response: questionResponsePayload.response,
                    score: questionResponsePayload.score ?? 0,
                  },
                };
              });
            }
          );
        } else if (!result.success) {
          console.error(result.message);
          return;
        }
      });
    });
  }, [navigate]);

  useEffect(() => {
    getRemarkInfoForStudent(questionIdForRegradeRef.current).then((result) => {
      console.log(result);
    });
  }, [questionIdForRegradeRef.current]);

  return (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <Modal
        modalShow={regradeModalShow}
        modalShowSet={regradeModalShowSet}
        content={
          <div className="flex flex-col w-full sm:w-96 gap-6">
            <h1 className="text-2xl font-bold">Requesting a regrade</h1>
            <AlertBanner ref={alertRef} />
            <div className="flex flex-col gap-4 text-gray-600">
              <span>
                Please reason your regrade request for question #
                {questionNumForRegrade}:
              </span>
              <textarea
                ref={studentCommentRef}
                className="simple-input h-36"
              />
            </div>
            <div className="flex gap-4 mt-2">
              <button
                className="btn-primary"
                onClick={() => {
                  alertRef.current.hide();
                  isLoadingSet(true);
                  createQuizRemark(
                    quizId,
                    questionIdForRegradeRef.current,
                    studentCommentRef.current.value
                  ).then((result) => {
                    isLoadingSet(false);
                    if (result.success) {
                      regradeModalShowSet(false);
                      toastMessageSet(
                        "The request has been sent to your instructor."
                      );
                      setTimeout(() => {
                        toastMessageSet();
                      }, 3000);
                    } else {
                      alertRef.current.setMessage(
                        "Cannot send request: " + result.message
                      );
                      alertRef.current.show();
                    }
                  });
                }}
              >
                {isLoading ? <Spinner className="-mt-1" /> : "Confirm"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => regradeModalShowSet(false)}
              >
                {isLoading ? <Spinner className="-mt-1" /> : "Cancel"}
              </button>
            </div>
          </div>
        }
      />
      <div className="px-4 md:px-24 w-full lg:w-[64rem] flex flex-col gap-4 sm:gap-8 text-gray-800">
        {quizObject &&
          quizObject.questions &&
          questionResponses &&
          quizObject.questions.map((questionObject, idx) => {
            return (
              <div
                className="h-fit w-full flex flex-col shadow-sm bg-white rounded-md py-8 md:py-12 px-8 sm:px-12 lg:px-16 border"
                key={idx}
              >
                <div className="w-full justify-between flex items-end mb-4">
                  <span className="font-semibold text-xs uppercase ml-2 text-gray-500">
                    Question {idx + 1} / {quizObject.questions.length}
                  </span>
                  <div className="inline-flex gap-2 items-end text-sm">
                    Grade:
                    <span className="font-medium text-lg -mb-1">
                      {questionResponses[questionObject._id].score} /{" "}
                      {questionObject.maxScore ?? 0}
                    </span>
                  </div>
                </div>
                <div className="border-b h-0 mb-6"></div>
                <div className="">
                  <QuestionWrapper
                    questionType={questionObject.type}
                    question={questionObject}
                    savedQuestionResponse={
                      questionResponses[questionObject._id].response
                    }
                    correctOptionIds={questionObject.answers}
                    readOnly={true}
                  />
                  <div className="w-full justify-end flex items-center mt-8">
                    <button
                      className="btn-outline w-fit px-4 text-sm py-2"
                      onClick={() => {
                        questionIdForRegradeRef.current = questionObject._id;
                        questionNumForRegradeSet(idx + 1);
                        regradeModalShowSet(true);
                        questionNumForRegradeSet(idx + 1);
                      }}
                    >
                      Request for regrade
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
