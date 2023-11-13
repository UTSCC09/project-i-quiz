import React from "react";
import Badge from "components/elements/Badge.jsx";
import colors from "tailwindcss/colors";
import { Link } from "react-router-dom";

function getQuizState(quizObject) {
  const startTime = new Date(quizObject.startTime);
  const endTime = new Date(quizObject.endTime);
  const currentTime = new Date();

  if (startTime > currentTime) {
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
  const submitted = quizObject.submitted;
  const quizState = getQuizState(quizObject);
  const startTimeStr = getFormattedDateStr(startTime);
  const endTimeStr = getFormattedDateStr(endTime);

  let quizAvailabilityPrompt, isAvailable;

  switch (quizState) {
    case "available":
      quizAvailabilityPrompt = "Available until " + startTimeStr;
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
  return (
    <>
      <Link
        to={"/quiz/" + quizObject.quizId}
        className="h-fit w-full rounded border-l-[12px] shadow shadow-gray-200 group cursor-pointer"
        style={{
          borderLeftColor: accentColor,
          pointerEvents: isAvailable ? "auto" : "none",
          opacity: isAvailable ? 1 : 0.5,
        }}
      >
        <div className="w-full py-4 md:py-6 h-fit bg-white group-hover:bg-gray-100 rounded-r border px-4 md:px-6 shrink-0 flex items-center transition-all">
          <div className="flex-col justify-center items-start inline-flex">
            <div className="items-center gap-2.5 inline-flex">
              <div className="md:text-lg font-semibold">{quizName}</div>
              {isAvailable && !submitted && (
                <div
                  className="w-2 h-2 shrink-0 rounded-full"
                  style={{ backgroundColor: accentColor }}
                ></div>
              )}
              <Badge label={courseCode} accentColor={accentColor} />
              {submitted && (
                <Badge label={"submitted"} accentColor={colors.green[600]} />
              )}
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
