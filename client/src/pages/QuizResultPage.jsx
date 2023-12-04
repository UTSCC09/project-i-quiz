import { getQuiz } from "api/QuizApi";
import { getQuizResponse } from "api/QuizResponseApi";
import QuestionWrapper from "components/question_components/QuestionWrapper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QuizResultPage() {
  const quizId = "656a3611e965cc1aa8f42abf";
  const navigate = useNavigate();
  const [quizObject, quizObjectSet] = useState();
  const [questionResponses, questionResponsesSet] = useState();

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

  return (
    <>
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
                    <button className="btn-outline w-fit px-4 text-sm py-2">
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
