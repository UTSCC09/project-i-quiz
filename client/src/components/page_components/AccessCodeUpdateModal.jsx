import { updateAccessCode } from "api/CourseApi";
import Modal from "components/elements/Modal";
import { useRef } from "react";
import AccessCodeInput from "./AccessCodeInput";

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
            <div
              ref={alertRef}
              className="rounded border-l-4 text-red-700 border-red-500 bg-red-50 p-4 text-sm col-span-6 hidden"
            ></div>
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
                alertRef.current.textContent =
                  "Course access code has to be at least 6 characters";
                alertRef.current.classList.remove("hidden");
                accessCodeInputRef.current.setValidationState(false);
                return;
              }
              alertRef.current.classList.add("hidden");
              updateAccessCode(courseObject.courseId, newAccessCode).then(
                (result) => {
                  if (result.success) {
                    onSuccess(newAccessCode);
                    modalShowSet(false);
                  } else {
                    alertRef.current.textContent = result.message;
                    alertRef.current.classList.remove("hidden");
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
