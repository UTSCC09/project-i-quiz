import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { getQuiz } from "api/QuizApi";
import { createQuizReponse, getQuizResponse } from "api/QuizResponseApi";
import { isStudentUserType } from "utils/CookieUtils";
import NavBar from "components/page_components/NavBar";
import Spinner from "components/elements/Spinner";

const QuizInfoPage = () => {
  const navigate = useNavigate();
  const isStudent = isStudentUserType();
  const { quizId } = useParams();

  const [quizObject, quizObjectSet] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [pageHeader, setPageHeader] = useState();
  const [pageMessage, setMessage] = useState();
  const [allowToStart, setAllowToStart] = useState(false);

  const onStartQuiz = (e) => {
    e.preventDefault();
    const questionResponses = quizObject.questions.map((question) => {
      return {
        question: question._id,
        response: [""],
      };
    });
    setIsLoading(true);
    createQuizReponse(quizId, questionResponses).then((payload) => {
      if (payload) {
        navigate("/quiz/" + quizId);
      } else {
        alert("Failed to create blank quiz response");
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (!isStudent) {
      navigate("/quiz/" + quizId);
      return;
    } else {
      setIsLoading(true);
      getQuiz(quizId).then((quizObj) => {
        const quizState = getQuizState(quizObj);

        if (quizState === "pending") {
          setPageHeader("Quiz Pending");
          setMessage("You should not be here. Please contact your instructor for more information");
        } else if (quizState === "upcoming") {
          setPageHeader("Quiz Unavailable");
          setMessage("This quiz is not available yet.");
        } else {
          getQuizResponse(quizId).then((result) => {
            //case 1: no response found
            if (!result.success && result.message === "No response found for this quiz") {
              //subcase 1: quiz is closed
              if (quizState === "closed") {
                setPageHeader("Quiz Closed");
                setMessage("Seems like you missed the deadline for this quiz. Please contact your instructor for more information.");
              } else { //subcase 2: quiz is available
                setPageHeader("Quiz Available");
                setMessage("Click the button below to start the quiz.");
                setAllowToStart(true);
              }
            }
            //case 2: response found, but not submitted
            else if (result.success && result.payload.status !== "submitted") {
              //subcase 1: quiz is closed
              if (quizState === "closed") {
                setPageHeader("Quiz Closed");
                setMessage("Seems like you missed the deadline for this quiz. Please contact your instructor for more information.");
              } else { //subcase 2: quiz is available
                navigate("/quiz/" + quizId);
              }
            }
            //case 3: response found, and submitted
            //subcase 1: quiz grade not released
            else if (!result.success && result.message === "Quiz grades not released yet") {
              setPageHeader("Quiz Submitted");
              setMessage("Your instructor is working on the grades. Please check back later.");
            }
            //subcase 2: quiz grade released
            else if (result.success && result.payload.status === "submitted") { //Assume grade released due to backned logic
              setPageHeader("Your quiz grade");
              setMessage("Your quiz grade.");
            }
            //case 4: error
            else {
              console.error(result.message);
              alert("Failed to fetch quiz response");
            }
          });
        }
        quizObjectSet(quizObj);
        setIsLoading(false);
      });
    }
  }, [isStudent, navigate, quizId]);

  return (
    <>
      <NavBar />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="min-h-screen w-full flex justify-center py-28 sm:py-36 bg-gray-100">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">{pageHeader}</h1>
            <p className="text-lg">{pageMessage}</p>
          </div>
          {allowToStart && (
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
      )}
    </>
  );
};

function getQuizState(quizObject) {
  const startTime = new Date(quizObject.startTime);
  const endTime = new Date(quizObject.endTime);
  const currentTime = new Date();

  if (quizObject.isDraft) {
    return "pending";
  } else if (startTime > currentTime) {
    return "upcoming";
  } else if (endTime >= currentTime) {
    return "available";
  } else {
    return "closed";
  }
}

export default QuizInfoPage;
