import { updateAccessCode } from "api/CourseApi";
import Modal from "components/elements/Modal";
import { useRef } from "react";
import AccessCodeInput from "./AccessCodeInput";
import AlertBanner from "components/elements/AlertBanner";

export default function AccessCodeUpdateModal({
  courseObject,
  onSuccess,
  modalShow,
  modalShowSet,
}) {
  const alertRef = useRef();
  const accessCodeInputRef = useRef();

  return (
    <Modal
      modalShow={modalShow}
      modalShowSet={modalShowSet}
      onClose={() => {}}
      content={
        <div className="flex flex-col w-96 gap-6">
          <h1 className="text-2xl font-bold">Update course access code</h1>
          <div className="flex flex-col gap-4">
            <AlertBanner ref={alertRef} />
            <span className="text-gray-600">
              Set a new access code for{" "}
              <b>
                {courseObject.courseCode} {courseObject.courseSemester}
              </b>
            </span>
            <span className="text-gray-600">
              <b>Note:</b> After setting the new access code, the current
              access code "{courseObject.accessCode}" will become invalid.
            </span>
          </div>
          <AccessCodeInput inputRef={accessCodeInputRef} />
          <button
            className="btn-primary"
            onClick={() => {
              const newAccessCode = accessCodeInputRef.current.getValue();
              if (newAccessCode.length < 6) {
                alertRef.current.setMessage(
                  "Course access code has to be at least 6 characters"
                );
                alertRef.current.show();
                accessCodeInputRef.current.setValidationState(false);
                return;
              }
              alertRef.current.hide();
              updateAccessCode(courseObject.courseId, newAccessCode).then(
                (result) => {
                  if (result.success) {
                    onSuccess(newAccessCode);
                    modalShowSet(false);
                  } else {
                    alertRef.current.setMessage(result.message);
                    alertRef.current.show();
                  }
                }
              );
            }}
          >
            Save
          </button>
        </div>
      }
    />
  );
}
