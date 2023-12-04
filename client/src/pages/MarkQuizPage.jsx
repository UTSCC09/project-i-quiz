import React, { useEffect, useRef, useState } from "react";
import NavBar from "components/page_components/NavBar";
import { ChevronIcon } from "components/elements/SVGIcons";
import { useNavigate, useParams } from "react-router";
import { getQuiz } from "api/QuizApi";
import {
  getAllStudentResponsesForQuiz,
  gradeQuizResponse,
} from "../api/QuizResponseApi";
import { isStudentUserType } from "utils/CookieUtils";
import colors from "tailwindcss/colors";
import Badge from "components/elements/Badge";

/* const questionResponses = [
  {
    question: "656c3b1a893cf182a7efa4cf",
    prompt: "OEQ#1",
    response: ["Hello this is my response for OEQ#1"],
    score: -1,
    maxScore: 5,
    _id: "656c3d9842cf9d204d51890e",
  },
  {
    question: "656c3b2a893cf182a7efa57a",
    prompt: "OEQ#2",
    response: ["Hello this is my response for OEQ#2"],
    score: -1,
    maxScore: 8,
    _id: "656c3d9842cf9d204d51890f",
  },
]; */

export default function MarkQuizPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [currResponseIdx, currResponseIdxSet] = useState(0);
  const [selectedScore, selectedScoreSet] = useState(-1);
  const isStudent = isStudentUserType();
  const [currStudentQuestionResponses, currStudentQuestionResponsesSet] =
    useState();
  const [quiz, quizSet] = useState();
  const gradeRequestsRef = useRef();

  useEffect(() => {
    if (isStudent) {
      navigate("/quiz-info/" + quizId);
    }
    getQuiz(quizId).then((quizObj) => {
      quizSet(quizObj);
      console.log(quizObj);
      getAllStudentResponsesForQuiz(quizId).then((result) => {
        if (result.success && result.payload) {
          const filteredResponses = result.payload.filter(
            (quizResponse) => quizResponse.status === "submitted"
          );
          const refObj = [];
          filteredResponses.forEach((response) => {
            response.questionResponses.forEach((questionResponse) => {
              quizObj.questions.forEach((question) => {
                console.log(question);
                if (
                  questionResponse.question.toString() ===
                  question._id.toString()
                ) {
                  refObj.push({
                    question: questionResponse.question,
                    prompt: question.prompt,
                    studentAnswer: questionResponse.response,
                    score: questionResponse.score,
                    comment: questionResponse.comment,
                    maxScore: question.maxScore,
                    student: response.student,
                    graded: response.graded,
                  });
                }
              });
            });
          });
          gradeRequestsRef.current = refObj
            .filter((q) => q.score === -1)
            .concat(refObj.filter((q) => q.score !== -1));
          currStudentQuestionResponsesSet(gradeRequestsRef.current);
          console.log(gradeRequestsRef.current);
        }
      });
    });
  }, [isStudent, navigate, quizId]);

  return (
    <>
      <NavBar
        additionalButtons={
          <button
            type="button"
            className="btn-outline px-4 text-sm py-2"
            onClick={() => {
              gradeQuizResponse(
                quizId,
                currStudentQuestionResponses[currResponseIdx].student,
                currStudentQuestionResponses,
                true
              ).then((result) => {
                console.log("grade result:", result);
              });
              navigate("/quiz-info/" + quizId);
            }}
          >
            Save Grading
          </button>
        }
      />
      <div className="fixed bottom-0 left-0 w-full">
        {currStudentQuestionResponses &&
          currStudentQuestionResponses.length !== 0 && (
            <MarkerComponent
              maxScore={currStudentQuestionResponses[currResponseIdx].maxScore}
              currIndex={currResponseIdx}
              responseCount={currStudentQuestionResponses.length}
              currResponseIdxSet={currResponseIdxSet}
              gradeRequestsRef={gradeRequestsRef}
              selectedScore={selectedScore}
              selectedScoreSet={selectedScoreSet}
            />
          )}
      </div>
      <div className="min-h-screen w-full flex justify-center pt-28 sm:pt-36 pb-[60vh] bg-gray-100">
        {currStudentQuestionResponses &&
        currStudentQuestionResponses[currResponseIdx] ? (
          <form className="px-4 md:px-24 w-full lg:w-[64rem] flex flex-col gap-4 sm:gap-8 text-gray-800">
            <div className="h-fit w-full flex flex-col shadow-sm bg-white rounded-md py-8 md:py-12 px-8 sm:px-12 lg:px-16 border">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-sm uppercase text-blue-600 mb-4">
                  Response {currResponseIdx + 1} /{" "}
                  {currStudentQuestionResponses.length}
                </span>
                <Badge
                  label={
                    currStudentQuestionResponses[currResponseIdx].score === -1
                      ? "ungraded"
                      : "graded"
                  }
                  accentColor={
                    currStudentQuestionResponses[currResponseIdx].score === -1
                      ? colors.yellow[500]
                      : colors.green[500]
                  }
                />
                <span className="font-semibold text-sm uppercase text-gray-600 mb-4">
                  Grade:{" "}
                  <span className="text-lg">
                    {currStudentQuestionResponses[currResponseIdx].score === -1
                      ? "?"
                      : currStudentQuestionResponses[currResponseIdx]
                          .score}{" "}
                    / {currStudentQuestionResponses[currResponseIdx].maxScore}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-sm font-bold text-gray-600">
                  Question Description
                </div>
                <div>
                  {currStudentQuestionResponses[currResponseIdx].prompt}
                </div>
                <div className="text-sm font-bold text-gray-600">
                  Student Response
                </div>
                <div>
                  {currStudentQuestionResponses[currResponseIdx].studentAnswer}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div>Loading ...</div>
        )}
      </div>
    </>
  );
}

function MarkerComponent({
  maxScore = 1,
  prevButtonRef,
  currIndex,
  responseCount,
  currResponseIdxSet,
  gradeRequestsRef,
  selectedScore,
  selectedScoreSet,
}) {
  const commentInputRef = useRef();

  useEffect(() => {
    selectedScoreSet(gradeRequestsRef.current[currIndex].score);
    commentInputRef.current.value =
      gradeRequestsRef.current[currIndex].comment;
  }, [currIndex, gradeRequestsRef, selectedScoreSet]);

  return (
    <div className="flex px-4 border-t bg-white py-8 items">
      <button
        ref={prevButtonRef}
        type="button"
        onClick={() => {
          currResponseIdxSet(currIndex - 1);
        }}
        className="btn-secondary mx-2 lg:mx-8 flex items-center justify-center px-2 lg:px-4 w-fit h-fit lg:mt-4 gap-2 text-sm"
        style={{
          opacity: currIndex === 0 ? "50%" : "100%",
          pointerEvents: currIndex === 0 ? "none" : "auto",
        }}
      >
        <ChevronIcon className="h-4 rotate-90" />
        <span className="hidden lg:block">Previous</span>
      </button>
      <div className="flex flex-col w-full mx-2">
        <div className="text-sm font-medium text-blue-600">Mark:</div>
        <div className="flex gap-4 py-4 flex-wrap">
          {[...Array(maxScore + 1).keys()].map((score) => {
            return (
              <div key={score}>
                <input
                  className="peer sr-only"
                  name="score"
                  type="radio"
                  checked={score === selectedScore}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => {
                    selectedScoreSet(score);
                    gradeRequestsRef.current[currIndex].score = score;
                  }}
                  className="h-8 w-8 border border-iquiz-blue text-iquiz-blue font-semibold rounded-full hover:text-white hover:bg-iquiz-blue transition-all peer-checked:text-white peer-checked:bg-iquiz-blue"
                >
                  {score}
                </button>
              </div>
            );
          })}
        </div>
        <div className="text-sm font-medium text-blue-600 mt-2">Comment:</div>
        <textarea
          ref={commentInputRef}
          className="simple-input mt-2"
          defaultValue={gradeRequestsRef.current[currIndex].comment}
          onChange={(e) => {
            gradeRequestsRef.current[currIndex].comment = e.target.value;
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          currResponseIdxSet(currIndex + 1);
        }}
        className="btn-secondary mx-2 lg:mx-8 flex items-center justify-center px-2 lg:px-4 w-fit h-fit lg:mt-4 gap-2 text-sm"
        style={{
          opacity: currIndex === responseCount - 1 ? "50%" : "100%",
          pointerEvents: currIndex === responseCount - 1 ? "none" : "auto",
        }}
      >
        <span className="hidden lg:block">Next</span>
        <ChevronIcon className="h-4 -rotate-90" />
      </button>
    </div>
  );
}
