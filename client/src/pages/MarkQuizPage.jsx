import React, { useEffect, useRef, useState } from "react";
import NavBar from "components/page_components/NavBar";
import { ChevronIcon } from "components/elements/SVGIcons";
import { useNavigate, useParams } from "react-router";

const questionResponses = [
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
];

export default function MarkQuizPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [currResponseIdx, currResponseIdxSet] = useState(0);
  const [selectedScore, selectedScoreSet] = useState(-1);

  const gradeRequestsRef = useRef(
    questionResponses.map((item) => {
      return {
        question: item.question,
        score: item.score,
        maxScore: item.maxScore,
        comment: "",
      };
    })
  );

  return (
    <>
      <NavBar
        additionalButtons={
          <button
            type="button"
            className="btn-outline px-4 text-sm"
            onClick={() => {
              /* TODO: Submit grade request*/
              navigate("/quiz-info/" + quizId);
            }}
          >
            Finish Grading
          </button>
        }
      />
      <div className="fixed bottom-0 left-0 w-full">
        <MarkerComponent
          maxScore={questionResponses[currResponseIdx].maxScore}
          currIndex={currResponseIdx}
          responseCount={questionResponses.length}
          currResponseIdxSet={currResponseIdxSet}
          gradeRequestsRef={gradeRequestsRef}
          selectedScore={selectedScore}
          selectedScoreSet={selectedScoreSet}
        />
      </div>
      <div className="min-h-screen w-full flex justify-center pt-28 sm:pt-36 pb-[60vh] bg-gray-100">
        {questionResponses[currResponseIdx] && (
          <form className="px-4 md:px-24 w-full lg:w-[64rem] flex flex-col gap-4 sm:gap-8 text-gray-800">
            <div className="h-fit w-full flex flex-col shadow-sm bg-white rounded-md py-8 md:py-12 px-8 sm:px-12 lg:px-16 border">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-sm uppercase text-blue-600 mb-4">
                  Response {currResponseIdx + 1} / {questionResponses.length}
                </span>
                <span className="font-semibold text-sm uppercase text-gray-600 mb-4">
                  Grade:{" "}
                  <span className="text-lg">
                    {gradeRequestsRef.current[currResponseIdx].score === -1
                      ? "?"
                      : gradeRequestsRef.current[currResponseIdx].score}{" "}
                    / {gradeRequestsRef.current[currResponseIdx].maxScore}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-sm font-bold text-gray-600">
                  Question Description
                </div>
                <div>{questionResponses[currResponseIdx].prompt}</div>
                <div className="text-sm font-bold text-gray-600">
                  Student Response
                </div>
                <div>{questionResponses[currResponseIdx].response}</div>
              </div>
            </div>
          </form>
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
  }, [currIndex, gradeRequestsRef]);

  return (
    <div className="flex px-4 border-t bg-white py-8 items">
      <button
        ref={prevButtonRef}
        type="button"
        onClick={() => {
          currResponseIdxSet(currIndex - 1);
        }}
        className="btn-secondary mx-8 flex items-center justify-center pl-4 pr-6 w-fit h-fit mt-4 gap-2 text-sm"
        style={{
          opacity: currIndex === 0 ? "50%" : "100%",
          pointerEvents: currIndex === 0 ? "none" : "auto",
        }}
      >
        <ChevronIcon className="h-4 rotate-90" />
        <span>Previous</span>
      </button>
      <div className="flex flex-col w-full">
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
        className="btn-secondary mx-8 flex items-center justify-center pr-4 pl-6 w-fit h-fit mt-4 gap-2 text-sm"
        style={{
          opacity: currIndex === responseCount - 1 ? "50%" : "100%",
          pointerEvents: currIndex === responseCount - 1 ? "none" : "auto",
        }}
      >
        <span>Next</span>
        <ChevronIcon className="h-4 -rotate-90" />
      </button>
    </div>
  );
}
