import React from "react";
import Badge from "components/elements/Badge.jsx";
import colors, { inherit } from "tailwindcss/colors";
import { Link } from "react-router-dom";
import { isStudentUserType } from "utils/CookieUtils";

function getQuizState(quizObject) {
  const startTime = new Date(quizObject.startTime);
  const endTime = new Date(quizObject.endTime);
  const currentTime = new Date();

  if (startTime > currentTime) {
    return "upcoming";
  } else if (endTime >= currentTime) {
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
  const isGradeReleased = quizObject.isGradeReleased;
  const quizState = getQuizState(quizObject);
  const startTimeStr = getFormattedDateStr(startTime);
  const endTimeStr = getFormattedDateStr(endTime);

  let quizAvailabilityPrompt;
  let isUpcoming = false;
  let isAvailable = false;
  let isClosed = false;

  switch (quizState) {
    case "available":
      quizAvailabilityPrompt = "Available until " + endTimeStr;
      isAvailable = true;
      break;
    case "upcoming":
      quizAvailabilityPrompt = "Unlocks on " + startTimeStr;
      isUpcoming = true;
      break;
    case "closed":
      quizAvailabilityPrompt = "Closed on " + endTimeStr;
      isClosed = true;
      break;
    default:
      break;
  }
  return (
    <>
      <Link
        to={"/quiz-info/" + quizObject.quizId}
        className="h-fit w-full rounded border-l-[12px] shadow shadow-gray-200 group cursor-pointer"
        style={{
          borderLeftColor: accentColor,
          //pointerEvents: isUpcoming ? "none" : "auto",
          opacity: isUpcoming ? 0.5 : 1,
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
              <div className="text-md 2xl:text-lg font-semibold overflow-hidden line-clamp-2 leading-tight 2xl:leading-tight text-ellipsis break-words mb-1">
                {quizName}
              </div>
              {isStudentUserType() &&
                (isAvailable && responseStatus !== "submitted" && (
                  <div className="w-2 h-2 shrink-0 rounded-full bg-red-500"></div>
                ))
              }
              <Badge label={courseCode} accentColor={accentColor} />
              {isStudentUserType() &&
                (isAvailable &&
                  (
                    responseStatus === "submitted" && (
                      <Badge iconId="submitted" accentColor={colors.green[600]} />
                    ) ||
                    responseStatus === "writing" && (
                      <Badge iconId="writing" accentColor={colors.gray[500]} />
                    )
                  )
                ) ||
                (isClosed &&
                  (
                    responseStatus !== "submitted" && (
                      <Badge iconId="missed" accentColor={colors.red[500]} />
                    ) ||
                    isGradeReleased && (
                      <Badge iconId="graded" accentColor={colors.green[500]} />
                    )
                  )
                )
              }
            </div>
            <div className="text-gray-500 text-xs font-normal">
              {quizAvailabilityPrompt}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
