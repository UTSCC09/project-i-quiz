import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { getQuiz } from "api/QuizApi";
import { createQuizReponse, getQuizResponse } from "api/QuizResponseApi";
import NavBar from "components/page_components/NavBar";
import { isStudentUserType } from "utils/CookieUtils";

const QuizInfoPage = () => {
  const isStudent = isStudentUserType();
  const { quizId } = useParams();
  const [quizObject, quizObjectSet] = useState();
  const [quizResponseSubmitted, setQuizResponseSubmitted] = useState(false);
  const navigate = useNavigate();

  const onStartQuiz = (e) => {
    e.preventDefault();

    const questionResponses = quizObject.questions.map((question) => {
      return {
        question: question._id,
        response: [""],
      };
    });

    createQuizReponse(quizId, questionResponses).then((payload) => {
      if (payload) {
        navigate("/quiz/" + quizId);
      } else {
        alert("Failed to create blank quiz response");
      }
    });
  };

  useEffect(() => {
    if (!isStudent) {
      navigate("/quiz/" + quizId);
      return;
    } else {
      getQuizResponse(quizId).then((result) => {
        if (
          !result.success &&
          result.message === "No response found for this quiz"
        ) {
          getQuiz(quizId).then((payload) => {
            quizObjectSet(payload);
          });
        } else if (result.success) {
          if (result.payload.status === "submitted") {
            setQuizResponseSubmitted(true);
          } else {
            navigate("/quiz/" + quizId);
          }
        } else {
          console.error(result.message);
          alert("Failed to fetch quiz response");
        }
      });
    }
  }, [isStudent, navigate, quizId]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen w-full flex justify-center py-28 sm:py-36 bg-gray-100">
        {quizResponseSubmitted ? (
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">Quiz Submitted</h1>
            <p className="text-lg">You have already submitted this quiz.</p>
          </div>
        ) : (
          <button
            className="btn-primary w-fit text-sm px-8 py-2 mt-2 place-self-end"
            type="button"
            style={{
              pointerEvents: quizObject ? "auto" : "none",
              opacity: quizObject ? 1 : 0.5,
            }}
            onClick={(e) => onStartQuiz(e)}
          >
            Start Quiz
          </button>
        )}
      </div>
    </>
  );
};

export default QuizInfoPage;
