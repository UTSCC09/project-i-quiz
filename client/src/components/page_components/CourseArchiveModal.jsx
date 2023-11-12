import React, { useRef } from "react";
import Modal from "components/elements/Modal";
import AlertBanner from "components/elements/AlertBanner";
import { archiveCourse } from "api/CourseApi";

export default function CourseArchiveModal({
  modalShow,
  modalShowSet,
  courseObject,
  onSuccess,
}) {
  const alertRef = useRef();

  if (!courseObject.archived) {
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
                Are you sure you want to archive{" "}
                <b>
                  {courseObject.courseCode} {courseObject.courseSemester}
                </b>
                ?{" "}
              </span>
              <span>
                By archiving a course on iQuiz, you will be put into the{" "}
                <b>archived section</b>.{" "}
              </span>
            </div>
            <div className="flex gap-4">
              <button
                className="btn-primary bg-red-600 border-red-600 hover:text-red-600 focus:ring-red-200"
                onClick={() => {
                  archiveCourse(courseObject.courseId).then((result) => {
                    if (result.success) {
                      modalShowSet(false);
                      onSuccess();
                    } else {
                      alertRef.current.setMessage(result.message);
                      alertRef.current.show();
                    }
                  });
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
  } else {
    return (
      <Modal
        modalShow={modalShow}
        modalShowSet={modalShowSet}
        content={
          <div className="flex flex-col sm:w-96 gap-6">
            <h1 className="text-2xl font-bold">Unarchiving a course</h1>
            <AlertBanner ref={alertRef} />
            <div className="flex flex-col gap-4 text-gray-600">
              <span>
                Are you sure you want to unarchive{" "}
                <b>
                  {courseObject.courseCode} {courseObject.courseSemester}
                </b>
                ?{" "}
              </span>
            </div>
            <div className="flex gap-4">
              <button
                className="btn-primary bg-red-600 border-red-600 hover:text-red-600 focus:ring-red-200"
                onClick={() => {
                  archiveCourse(courseObject.courseId).then((result) => {
                    if (result.success) {
                      modalShowSet(false);
                      onSuccess();
                    } else {
                      alertRef.current.setMessage(result.message);
                      alertRef.current.show();
                    }
                  });
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
}
