import { getQuiz } from "api/QuizApi";
import { getQuizResponse } from "api/QuizResponseApi";
import QuestionWrapper from "components/question_components/QuestionWrapper";
import { useEffect, useState } from "react";

export default function QuizResultPage() {
  const quizId = "656a3611e965cc1aa8f42abf";
  const [quizObject, quizObjectSet] = useState();
  const [responses, responsesSet] = useState({});

  useEffect(() => {
    getQuiz(quizId).then((quizPayload) => {
      quizObjectSet(quizPayload);
      getQuizResponse(quizId).then((result) => {
        if (
          (!result.success &&
            result.message === "Quiz grades not released yet") ||
          (result.success && result.payload.status === "submitted")
        ) {
          // navigate("/quiz-info/" + quizId);
          return;
        } else if (result.success) {
          result.payload.questionResponses.forEach((questionResponse) => {
            responsesSet((prev) => {
              return {
                ...prev,
                [questionResponse.question]: questionResponse.response,
              };
            });
          });
        } else if (!result.success) {
          console.error(result.message);
          return;
        }
      });
    });
  }, []);

  return (
    <div className="px-4 md:px-24 w-full lg:w-[64rem] flex flex-col gap-4 sm:gap-8 text-gray-800">
      {quizObject &&
        quizObject.questions &&
        quizObject.questions.map((questionObject, idx) => {
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
                  savedQuestionResponse={responses[questionObject._id]}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
