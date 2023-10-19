
import React from "react";
import Badge from "components/elements/Badge.jsx";

function getQuizState(quizObject) {
  const startTime = new Date(quizObject.startTime);
  const endTime = new Date(quizObject.endTime);
  const currentTime = new Date();

  if (startTime > currentTime) {
    return "upcoming"
  }
  else if (endTime > currentTime) {
    return "available";
  }
  else {
    return "expired";
  }
}

// quizState: available, upcoming, expired
export default function QuizCard({ quizObject }) {
  const quizName = quizObject.quizName;
  const courseCode = quizObject.courseCode;
  const endTime = new Date(quizObject.endTime);
  const accentColor = quizObject.accentColor;

  const quizState = getQuizState(quizObject);

  let quizAvailabilityPrompt, isAvailable;

  switch (quizState) {
    case "available":
      quizAvailabilityPrompt = "Available untill";
      isAvailable = true;
      break;
    case "upcoming":
      quizAvailabilityPrompt = "Unlocks on";
      isAvailable = false;
      break;
    case "expired":
      quizAvailabilityPrompt = "Expired on";
      isAvailable = false;
      break;
  }

  const dateFormatOptions = { month: "short", day: "numeric" };
  const timeFormatOptions = { hour: "numeric", minute: "numeric" };
  return (
    <>
      <div className="h-fit rounded border-l-[12px] shadow shadow-gray-200 group cursor-pointer" style={{ borderLeftColor: accentColor, pointerEvents: isAvailable ? "auto" : "none", opacity: isAvailable ? 1 : 0.5 }}>
        <div className="w-full py-4 md:py-0 h-fit md:h-24 bg-white group-hover:bg-gray-100 rounded-r border px-4 md:px-6 shrink-0 flex items-center transition">
          <div className="flex-col justify-center items-start inline-flex">
            <div className="items-center gap-2.5 inline-flex">
              <div className="md:text-lg font-semibold">
                {quizName}
              </div>
              {isAvailable &&
                <div className="w-2 h-2 shrink-0 rounded-full" style={{ backgroundColor: accentColor }}></div>
              }
              <Badge label={courseCode} accentColor={accentColor} />
            </div>
            <div className="text-gray-500 text-xs font-normal">
              {quizAvailabilityPrompt + " " + endTime.toLocaleDateString(undefined, dateFormatOptions) + " at " + endTime.toLocaleTimeString(undefined, timeFormatOptions)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
