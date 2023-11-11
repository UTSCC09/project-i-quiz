import React, { useRef, useState } from "react";
import SingleLineInput from "components/elements/SingleLineInput";
import Modal from "components/elements/Modal";
import ColorPicker from "./ColorPicker";
import Badge from "components/elements/Badge";
import AlertBanner from "components/elements/AlertBanner";

async function enrollInCourse(courseId, accentColor, sessionNumber) {
  return fetch("/api/courses/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({
      courseId,
      accentColor,
      sessionNumber,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        return result.payload;
      }
    });
}

export default function CourseEnrollModal({
  enrollModalShow,
  enrollModalShowSet,
  onSuccess,
}) {
  const courseAccessCodeInputRef = useRef();
  const alertRef = useRef();
  const [step, stepSet] = useState(0);
  const [colorPicked, colorPickedSet] = useState();
  const [sessionPicked, sessionPickedSet] = useState();
  const [enrollInfo, enrollInfoSet] = useState();

  function resetAllStates() {
    stepSet(0);
    colorPickedSet();
    sessionPickedSet();
    enrollInfoSet();
  }

  return (
    <Modal
      modalShow={enrollModalShow}
      modalShowSet={enrollModalShowSet}
      onClose={() => {
        resetAllStates();
      }}
      content={
        <div className="sm:w-96">
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold">Add a new course</h1>
              <span className="text-gray-600">
                Please enter the access code provided by your course
                instructor.
              </span>
              <form
                className="gap-6 flex flex-col"
                onSubmit={(e) => e.preventDefault()}
              >
                <AlertBanner ref={alertRef} />
                <SingleLineInput
                  ref={courseAccessCodeInputRef}
                  label="Course Access Code"
                />
                <button
                  className="btn-primary"
                  onClick={(e) => {
                    e.target.focus();
                    if (
                      !courseAccessCodeInputRef.current.validate("required")
                    ) {
                      return;
                    }
                    fetch(
                      "/api/courses/enroll_info/" +
                        courseAccessCodeInputRef.current.getValue(),
                      {
                        method: "GET",
                        withCredentials: true,
                      }
                    )
                      .then((response) => response.json())
                      .then((result) => {
                        if (result.success) {
                          enrollInfoSet(result);
                          stepSet(step + 1);
                        } else {
                          alertRef.current.setMessage(result.message);
                          alertRef.current.show();
                          courseAccessCodeInputRef.current.setValidationState(
                            false
                          );
                        }
                      });
                  }}
                >
                  Next
                </button>
              </form>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-6 w-96">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  Enroll in {enrollInfo.courseCode}
                </h1>
                <Badge label={enrollInfo.courseSemester} />
              </div>
              <div className="text-gray-600 flex flex-col gap-2">
                <span>Choose the session that you are enrolled in.</span>
                <span>
                  If you are unsure about this, please{" "}
                  <span className="underline underline-offset-1">
                    confirm with your course instructor
                  </span>{" "}
                  <span className="font-medium">
                    ({enrollInfo.instructor})
                  </span>{" "}
                  before you proceed.
                </span>
              </div>
              <div className="flex flex-wrap gap-4 w-full my-4">
                {enrollInfo.sessions.map((session, idx) => {
                  return (
                    <div onClick={() => sessionPickedSet(session)} key={idx}>
                      <input
                        type="radio"
                        value={session}
                        checked={sessionPicked === session}
                        name="sessionPicker"
                        className="hidden peer"
                        readOnly
                      />
                      {/* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */}
                      <span className="cursor-pointer hover:opacity-50 px-4 py-2 transition-all rounded border font-medium text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600">
                        {session}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                className="btn-primary"
                style={{
                  opacity: sessionPicked ? 1 : 0.4,
                  pointerEvents: sessionPicked ? "auto" : "none",
                }}
                onClick={() => {
                  stepSet(step + 1);
                }}
              >
                Enroll
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <div>Pick a color for {enrollInfo.courseCode}</div>
                <Badge
                  label={enrollInfo.courseSemester}
                  accentColor={colorPicked}
                />
              </h1>
              <div className="flex flex-col gap-4 text-gray-600">
                <span>Pick an accent color for your newly added course.</span>
                <span>
                  Don't worry, you will be able to change it at anytime.
                </span>
              </div>
              <ColorPicker
                colorPicked={colorPicked}
                colorPickedSet={colorPickedSet}
              />
              <button
                className="btn-primary"
                style={{
                  opacity: colorPicked ? 1 : 0.4,
                  pointerEvents: colorPicked ? "auto" : "none",
                }}
                onClick={() => {
                  enrollInCourse(
                    enrollInfo.courseId,
                    colorPicked,
                    sessionPicked
                  ).then((payload) => {
                    onSuccess(payload.courseCode, payload.courseSemester);
                    enrollModalShowSet(false);
                    resetAllStates();
                  });
                }}
              >
                Enroll
              </button>
            </div>
          )}
        </div>
      }
    />
  );
}
