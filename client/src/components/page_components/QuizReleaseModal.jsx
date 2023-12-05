import React, { useEffect, useRef, useState } from "react";
import Modal from "components/elements/Modal";
import AlertBanner from "components/elements/AlertBanner";
import { createQuiz, releaseQuiz } from "api/QuizApi";
import { Spinner } from "components/elements/SVGIcons";

export default function QuizReleaseModal({
  modalShow,
  modalShowSet,
  quizData,
  quizId,
  onSuccess,
}) {
  const alertRef = useRef();
  const quizStartTimeInputRef = useRef();
  const quizEndTimeInputRef = useRef();
  const [quizCreationData, quizCreationDataSet] = useState();
  const [isLoading, isLoadingSet] = useState(false);

  useEffect(() => {
    quizCreationDataSet(quizData);
  }, [quizData, quizCreationDataSet]);

  const addQuizCreationData = (key, value) => {
    let newData = quizCreationData;
    newData[key] = value;
    quizCreationDataSet(newData);
  };

  const submitCreateQuizForm = async (e) => {
    isLoadingSet(true);
    e.preventDefault();

    let startTime = Date.parse(quizStartTimeInputRef.current.value);
    let endTime = Date.parse(quizEndTimeInputRef.current.value);
    if (endTime < startTime) {
      alertRef.current.setMessage(
        "The end time must be later than the start time"
      );
      alertRef.current.show();
      return;
    }

    alertRef.current.hide();

    addQuizCreationData("startTime", quizStartTimeInputRef.current.value);
    addQuizCreationData("endTime", quizEndTimeInputRef.current.value);

    if (quizId) {
      releaseQuiz(quizId, startTime, endTime).then((result) => {
        isLoadingSet(false);
        if (result.success) {
          onSuccess(result.payload.quizName);
          modalShowSet(false);
        } else {
          alertRef.current.setMessage(
            result.message || "Could not release quiz. Please try again later"
          );
          alertRef.current.show();
        }
      });
    } else {
      createQuiz({ ...quizCreationData, isDraft: false }).then((result) => {
        isLoadingSet(false);
        if (result.success) {
          onSuccess(result.payload.quizName);
          modalShowSet(false);
        } else {
          alertRef.current.setMessage(
            result.message || "Could not release quiz. Please try again later"
          );
          alertRef.current.show();
        }
      });
    }
  };

  return (
    <Modal
      modalShow={modalShow}
      modalShowSet={modalShowSet}
      onClose={() => {}}
      content={
        <div className="w-full sm:w-96">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Release quiz</h1>
            <span className="text-gray-600">
              Set the start and end time for the quiz
            </span>
            <form
              autoComplete="off"
              className="gap-6 flex flex-col"
              onSubmit={submitCreateQuizForm}
            >
              <AlertBanner ref={alertRef} />
              <div className="relative flex flex-col gap-4">
                <div className="flex flex-col gap-4 text-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm w-24">Start time:</div>
                    <input
                      name="quizStartTime"
                      ref={quizStartTimeInputRef}
                      className="border outline-none focus:ring ring-blue-200 rounded-md py-3 px-4 text-sm w-full cursor-pointer hover:bg-gray-50 transition-all"
                      type="datetime-local"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm w-24">End time:</div>
                    <input
                      name="quizEndTime"
                      ref={quizEndTimeInputRef}
                      className="border outline-none focus:ring ring-blue-200 rounded-md py-3 px-4 text-sm w-full cursor-pointer hover:bg-gray-50 transition-all"
                      type="datetime-local"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-primary">
                {isLoading ? <Spinner className="-mt-1" /> : "Confirm"}
              </button>
            </form>
          </div>
        </div>
      }
    />
  );
}
