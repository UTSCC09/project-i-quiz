import React, { useEffect, useRef, useState } from "react";
import SingleLineInput from "components/elements/SingleLineInput";
import Modal from "components/elements/Modal";
import ColorPicker from "./ColorPicker";
import Badge from "components/elements/Badge";
import AlertBanner from "components/elements/AlertBanner";
import { enrollInCourse } from "api/CourseApi";

export default function CourseEnrollModal({
  enrollModalShow,
  enrollModalShowSet,
  onSuccess,
}) {
  const [step, stepSet] = useState(0);
  const enrollInfoRef = useRef({});

  return (
    <Modal
      modalShow={enrollModalShow}
      modalShowSet={enrollModalShowSet}
      onClose={() => {
        stepSet(0);
      }}
      content={
        <div className="w-full sm:w-96">
          {step === 0 && (
            <AccessCodeForm
              enrollInfoRef={enrollInfoRef}
              next={() => stepSet(1)}
            />
          )}
          {step === 1 && (
            <ChooseSessionForm
              enrollInfoRef={enrollInfoRef}
              next={() => stepSet(2)}
            />
          )}
          {step === 2 && (
            <AccentColorForm
              enrollInfoRef={enrollInfoRef}
              onSuccess={(payload) => {
                onSuccess(payload);
                stepSet(0);
              }}
              close={() => enrollModalShowSet(false)}
            />
          )}
        </div>
      }
    />
  );
}

function AccessCodeForm({ enrollInfoRef, next }) {
  const courseAccessCodeInputRef = useRef();
  const alertRef = useRef();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Add a new course</h1>
      <span className="text-gray-600">
        Please enter the access code provided by your course instructor.
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
            if (!courseAccessCodeInputRef.current.validate("required")) {
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
                  enrollInfoRef.current = result;
                  next();
                } else {
                  alertRef.current.setMessage(result.message);
                  alertRef.current.show();
                  courseAccessCodeInputRef.current.setValidationState(false);
                }
              });
          }}
        >
          Next
        </button>
      </form>
    </div>
  );
}

function ChooseSessionForm({ enrollInfoRef, next }) {
  const [sessionPicked, sessionPickedSet] = useState();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">
          Enroll in {enrollInfoRef.current.courseCode}
        </h1>
        <Badge label={enrollInfoRef.current.courseSemester} />
      </div>
      <div className="text-gray-600 flex flex-col gap-2">
        <span>Choose the session that you are enrolled in.</span>
        <span>
          If you are unsure about this, please{" "}
          <span className="underline underline-offset-1">
            confirm with your course instructor
          </span>{" "}
          <span className="font-medium">
            ({enrollInfoRef.current.instructor})
          </span>{" "}
          before you proceed.
        </span>
      </div>
      <div className="flex flex-wrap gap-4 w-full my-4">
        {enrollInfoRef.current.sessions.map((session, idx) => {
          return (
            <div
              onClick={() => {
                sessionPickedSet(session);
              }}
              key={idx}
            >
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
          enrollInfoRef.current["sessionNumber"] = sessionPicked;
          next();
        }}
      >
        Enroll
      </button>
    </div>
  );
}

function AccentColorForm({ enrollInfoRef, onSuccess }) {
  const alertRef = useRef();
  const [colorPicked, colorPickedSet] = useState();

  function onError(message) {
    alertRef.current.setMessage(message);
    alertRef.current.show();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <AlertBanner ref={alertRef} />
        <div>Pick a color for {enrollInfoRef.current.courseCode}</div>
        <Badge
          label={enrollInfoRef.current.courseSemester}
          accentColor={colorPicked}
        />
      </h1>
      <div className="flex flex-col gap-4 text-gray-600">
        <span>Pick an accent color for your newly added course.</span>
        <span>Don't worry, you will be able to change it at anytime.</span>
      </div>
      <ColorPicker colorPicked={colorPicked} colorPickedSet={colorPickedSet} />
      <button
        className="btn-primary"
        style={{
          opacity: colorPicked ? 1 : 0.4,
          pointerEvents: colorPicked ? "auto" : "none",
        }}
        onClick={() => {
          enrollInCourse(
            enrollInfoRef.current.courseId,
            colorPicked,
            enrollInfoRef.current.sessionNumber,
            onSuccess,
            onError
          );
        }}
      >
        Enroll
      </button>
    </div>
  );
}
