import Modal from "components/elements/Modal";
import { useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import AlertBanner from "components/elements/AlertBanner";
import { updateAccentColor } from "api/CourseApi";

export default function CourseAccentColorModal({
  courseObject,
  onSuccess,
  modalShow,
  modalShowSet,
}) {
  const [colorPicked, colorPickedSet] = useState();
  const alertRef = useRef();

  useEffect(() => {
    colorPickedSet(courseObject.accentColor);
  }, [colorPickedSet, courseObject]);

  return (
    <Modal
      modalShow={modalShow}
      modalShowSet={modalShowSet}
      onClose={() => colorPickedSet(courseObject.accentColor)}
      content={
        <div className="flex flex-col w-96 gap-6">
          <h1 className="text-2xl font-bold">Fresh color, fresh start</h1>
          <AlertBanner ref={alertRef} />
          <span className="w-96 text-gray-600">
            Pick a new accent color for{" "}
            <b>
              {courseObject.courseCode} {courseObject.courseSemester}
            </b>
          </span>
          <ColorPicker
            colorPicked={colorPicked}
            colorPickedSet={colorPickedSet}
          />
          <button
            className="btn-primary"
            onClick={() => {
              updateAccentColor(courseObject.courseId, colorPicked).then(
                (result) => {
                  if (result.success) {
                    modalShowSet(false);
                    onSuccess();
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
