import React, { useRef } from "react";
import Modal from "components/elements/Modal";
import SingleLineInput from "components/elements/SingleLineInput";
import AlertBanner from "components/elements/AlertBanner";
import { dropCourse } from "api/CourseApi";

export default function CourseDropModal({
  modalShow,
  modalShowSet,
  courseObject,
  onSuccess,
}) {
  const alertRef = useRef();
  const courseCodeInputRef = useRef();
  const semesterInputRef = useRef();
  const yearInputRef = useRef();

  return (
    <Modal
      modalShow={modalShow}
      modalShowSet={modalShowSet}
      content={
        <div className="flex flex-col sm:w-96 gap-6">
          <h1 className="text-2xl font-bold">Dropping a course</h1>
          <AlertBanner ref={alertRef} />
          <div className="flex flex-col gap-4 text-gray-600">
            <span>
              Are you sure you want to drop{" "}
              <b>
                {courseObject.courseCode} {courseObject.courseSemester}
              </b>
              ?{" "}
            </span>
            <span>
              By dropping a course on iQuiz, you will <b>lose access</b> to any
              quizzes from the course, including your own <b>quiz history</b>.{" "}
            </span>
            <span>
              To confirm, enter the course code, semester, and the year of the
              course that you wish to drop.
            </span>
            <span className="mt-2 text-red-600">
              <b>Warning:</b> This action can <b>NOT</b> be undone
            </span>
          </div>
          <div className="flex gap-2">
            <div className="w-[20rem]">
              <SingleLineInput ref={courseCodeInputRef} label="Course code" />
            </div>
            <SingleLineInput ref={semesterInputRef} label="Semester" />
            <SingleLineInput
              ref={yearInputRef}
              label="Year"
              maxLength={2}
              numberOnly
            />
          </div>
          <div className="flex gap-4">
            <button
              className="btn-primary bg-red-600 border-red-600 hover:text-red-600"
              onClick={() => {
                const enteredCourseCode =
                  courseCodeInputRef.current.getValue();
                const enteredSemester = semesterInputRef.current.getValue();
                const enteredYear = yearInputRef.current.getValue();
                let validated = true;

                if (enteredCourseCode !== courseObject.courseCode) {
                  courseCodeInputRef.current.setValidationState(false);
                  validated = false;
                }
                if (
                  enteredSemester !== courseObject.courseSemester.split(" ")[0]
                ) {
                  semesterInputRef.current.setValidationState(false);
                  validated = false;
                }
                if (
                  enteredYear !== courseObject.courseSemester.split(" ")[1]
                ) {
                  yearInputRef.current.setValidationState(false);
                  validated = false;
                }

                if (validated) {
                  dropCourse(courseObject.courseId).then((result) => {
                    if (result.success) {
                      modalShowSet(false);
                      onSuccess();
                    } else {
                      alertRef.current.setMessage(result.message);
                      alertRef.current.show();
                    }
                  });
                }
              }}
            >
              Confirm
            </button>
            <button
              className="btn-secondary"
              onClick={() => modalShowSet(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      }
    />
  );
}
