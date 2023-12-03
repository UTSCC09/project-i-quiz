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

export default function MarkQuizPage() {
  const isStudent = isStudentUserType();
  const { quizId } = useParams();
  const [quizObject, quizObjectSet] = useState();
  let savedQuizResponse = useMemo(() => {
    return JSON.parse(localStorage.getItem("savedQuizResponse")) ?? {};
  }, []);
  const [canEdit, setCanEdit] = useState(true);
  const [canSubmit, setCanSubmit] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getQuiz(quizId).then((quizPayload) => {
      quizObjectSet(quizPayload);
    });

    return () => {
      localStorage.removeItem("savedQuizResponse");
    };
  }, [isStudent, navigate, quizId, quizObjectSet]);

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
                      ) => {}}
                    />
                  </div>
                </div>
              );
            })}
          </form>
        )}
      </div>
    </>
  );
}
