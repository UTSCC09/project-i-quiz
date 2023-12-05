import React, { useRef, useState } from "react";
import Modal from "components/elements/Modal";
import AlertBanner from "components/elements/AlertBanner";
import SimpleCheckBox from "components/elements/SimpleCheckBox";
import { v4 } from "uuid";

export default function JSONImportModal({
  modalShow,
  modalShowSet,
  questionListSet,
}) {
  const alertRef = useRef();
  const textAreaRef = useRef();
  const [replaceToggle, replaceToggleSet] = useState(false);

  return (
    <Modal
      modalShow={modalShow}
      modalShowSet={modalShowSet}
      onClose={() => { }}
      content={
        <div className="w-full sm:w-[30rem]">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Import questions from JSON</h1>

            <div className="flex flex-col gap-4 text-gray-600">
              <div>You can import questions from JSON file.</div>
              <div>The JSON file must follow iQuiz format.</div>
            </div>
            <div className="gap-6 flex flex-col">
              <AlertBanner ref={alertRef} />
              <textarea
                ref={textAreaRef}
                className="border rounded-md px-6 py-4 resize-y outline-none focus:ring ring-blue-200 transition-all h-32 sm:h-48"
                placeholder="Paste the JSON object here"
              />
              <SimpleCheckBox
                label="Replace existing questions"
                isChecked={replaceToggle}
                isCheckedSet={replaceToggleSet}
              />
              <button
                type="submit"
                className="btn-primary"
                onClick={() => {
                  try {
                    const importedQuestionList = JSON.parse(
                      textAreaRef.current.value
                    ).map((question) => {
                      /* Set unique qid for imported questions */
                      return {
                        ...question,
                        id: v4(),
                      };
                    });
                    if (replaceToggle) {
                      questionListSet(importedQuestionList);
                    } else {
                      questionListSet((prevState) =>
                        prevState.concat(importedQuestionList)
                      );
                    }
                    modalShowSet(false);
                  } catch (err) {
                    alertRef.current.setMessage(err.message);
                    alertRef.current.show();
                  }
                }}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}
