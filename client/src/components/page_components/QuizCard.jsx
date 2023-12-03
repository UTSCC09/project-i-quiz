import React from "react";
import Badge from "components/elements/Badge.jsx";
import colors, { inherit } from "tailwindcss/colors";
import { Link } from "react-router-dom";
import { isStudentUserType } from "utils/CookieUtils";
import { generateStudentQuizPDF } from "api/QuizResponseApi";
import { generateInstructorQuizPDF } from "api/QuizApi";
import DropdownMenu from "components/elements/DropdownMenu";
import { AdjustmentsIcon } from "components/elements/SVGIcons";

function getQuizState(quizObject) {
  const startTime = new Date(quizObject.startTime);
  const endTime = new Date(quizObject.endTime);
  const currentTime = new Date();

  if (quizObject.isDraft) {
    return "pending";
  } else if (startTime > currentTime) {
    return "upcoming";
  } else if (endTime > currentTime) {
    return "available";
  } else {
    return "closed";
  }
}

function getFormattedDateStr(time) {
  const dateFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const timeFormatOptions = { hour: "numeric", minute: "numeric" };
  return (
    time.toLocaleDateString(undefined, dateFormatOptions) +
    " at " +
    time.toLocaleTimeString(undefined, timeFormatOptions)
  );
}

// quizState: available, upcoming, closed
export default function QuizCard({ accentColor = "#0366FF", quizObject }) {
  const quizName = quizObject.quizName;
  const courseCode = quizObject.courseCode;
  const startTime = new Date(quizObject.startTime);
  const endTime = new Date(quizObject.endTime);
  const responseStatus = quizObject.responseStatus;
  const quizState = getQuizState(quizObject);
  const startTimeStr = getFormattedDateStr(startTime);
  const endTimeStr = getFormattedDateStr(endTime);

  let quizAvailabilityPrompt, isAvailable;
  let isStudent = isStudentUserType();
  let quizEditOptions = [];

  switch (quizState) {
    case "available":
      quizAvailabilityPrompt = "Available until " + endTimeStr;
      isAvailable = true;
      break;
    case "upcoming":
      quizAvailabilityPrompt = "Unlocks on " + startTimeStr;
      isAvailable = false;
      break;
    case "closed":
      quizAvailabilityPrompt = "Closed on " + endTimeStr;
      isAvailable = false;
      break;
    default:
      break;
  }

  if (!isStudent) {
    isAvailable = true;
    quizEditOptions.push({
      label: "Download PDF",
      onClick: () => {
        generateInstructorQuizPDF(quizObject.quizId);
      },
    });
  } 
  if (isStudent && responseStatus === 'submitted'){
    quizEditOptions.push({
      label: "Download PDF",
      onClick: () => {
        generateStudentQuizPDF(quizObject.quizId);
      },
    });
  }

  return (
    <>
    <Link
        to={"/quiz-info/" + quizObject.quizId}
        className="h-fit w-full rounded border-l-[12px] shadow shadow-gray-200 group cursor-pointer"
        style={{
          borderLeftColor: accentColor,
          pointerEvents: isAvailable ? "auto" : "none",
          opacity: isAvailable ? 1 : 0.5,
        }}
      >
        <div
          className="w-full py-4 md:py-6 h-20 md:h-24 bg-white group-hover:bg-gray-100 rounded-r border px-4 md:px-6 shrink-0 flex items-center transition-all"
          style={{
            borderColor: responseStatus === "writing" ? accentColor : inherit,
            borderWidth: responseStatus === "writing" ? 1.5 : 1,
          }}
        >
          <div className="flex-col justify-center items-start inline-flex">
            <div className="items-center gap-2.5 inline-flex w-full overflow-hidden">
              <div className="text-md 2xl:text-lg font-semibold overflow-hidden line-clamp-2 leading-tight 2xl:leading-tight text-ellipsis break-words">
                {quizName}
              </div>
              {isAvailable &&
                isStudentUserType() &&
                responseStatus !== "submitted" && (
                  <div className="w-2 h-2 shrink-0 rounded-full bg-red-500"></div>
                )}
              <Badge label={courseCode} accentColor={accentColor} />
              {responseStatus === "submitted" && (
                <Badge iconId="submitted" accentColor={colors.green[600]} />
              )}
              {(responseStatus === "writing" || quizState === "pending") && (
                <Badge iconId="writing" accentColor={colors.gray[500]} />
              )}
            </div>
            {quizAvailabilityPrompt && (
              <div className="text-gray-500 text-xs font-normal mt-1">
                {quizAvailabilityPrompt}
              </div>
            )}
          </div>
        </div>
      </Link>
      { quizEditOptions.length !== 0 &&
        <div className="flex gap-2 sm:gap-4 text-gray-700">
          <div className="flex gap-2 sm:gap-4">
            <DropdownMenu
              buttonElement={
                <button className="bg-white shadow-sm h-8 sm:h-10 w-8 sm:w-10 text-center rounded-md border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all">
                  <AdjustmentsIcon className="h-[18px] sm:h-5" />
                </button>
              }
              options={quizEditOptions}
              menuAlignRight
            />
          </div>
        </div>
      }
    </>
  );
}
