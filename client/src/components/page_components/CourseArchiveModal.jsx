import React, { useRef } from "react";
import Modal from "components/elements/Modal";
import SingleLineInput from "components/elements/SingleLineInput";
import AlertBanner from "components/elements/AlertBanner";
import { archiveCourse } from "api/CourseApi";

export default function CourseArchiveModal({
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
          <h1 className="text-2xl font-bold">Archiving a course</h1>
          <AlertBanner ref={alertRef} />
          <div className="flex flex-col gap-4 text-gray-600">
            <span>
              Are you sure you want to archive {" "}
              <b>
                {courseObject.courseCode} {courseObject.courseSemester}
              </b>
              ?{" "}
            </span>
            <span>
              By archiving a course on iQuiz, you will be unable to access
              quizzes from the course, including your own <b>quiz history</b>.{" "}
            </span>
            <span>
              To confirm, enter the course code, semester, and the year of the
              course that you wish to archive.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SingleLineInput ref={courseCodeInputRef} label="Course code" />

            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3">
                <SingleLineInput ref={semesterInputRef} label="Semester" />
              </div>
              <div className="col-span-2">
                <SingleLineInput
                  ref={yearInputRef}
                  label="Year"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              className="btn-primary bg-red-600 border-red-600 hover:text-red-600 focus:ring-red-200"
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
                  archiveCourse(courseObject.courseId).then((result) => {
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
