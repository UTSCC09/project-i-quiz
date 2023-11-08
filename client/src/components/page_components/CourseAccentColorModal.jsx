import Modal from "components/elements/Modal";
import { useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";

export default function CourseAccentColorModal({
  courseObject,
  updateAccentColor,
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
          <div
            ref={alertRef}
            className="rounded border-l-4 text-red-700 border-red-500 bg-red-50 p-4 text-sm col-span-6 hidden"
          ></div>
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
                    onSuccess();
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
