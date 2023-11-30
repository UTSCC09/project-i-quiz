import React, { useRef } from "react";
import Modal from "components/elements/Modal";
import AlertBanner from "components/elements/AlertBanner";
import { sendQuizInvitations } from "api/CourseApi";
import Badge from "components/elements/Badge";

export default function QuizInviteModal({
  modalShow,
  modalShowSet,
  quizObject,
}) {
  const alertRef = useRef();

  return (
    <Modal
      modalShow={modalShow}
      modalShowSet={modalShowSet}
      content={
        <div className="flex flex-col sm:w-96 gap-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {quizObject.quizName}
            </h1>
            <Badge
              label={quizObject.courseCode}
              accentColor={""}
            />
          </div>
          <AlertBanner ref={alertRef} />
          <div className="flex flex-col gap-3 text-gray-800">
            <span>
              Are you sure you want to send quiz email invitations for {" "}
              <b>
                {quizObject.quizName}
              </b>
              {" "} to all your students enrolled in <b>{quizObject.courseCode}</b>?
            </span>
          </div>
          <div className="flex gap-4 mt-2">
            <button
              className="btn-primary"
              onClick={() => {
                sendQuizInvitations(quizObject.courseId, quizObject.quizId).then((result) => {
                  if (result.success) {
                    modalShowSet(false);
                  } else {
                    alertRef.current.setMessage(result.message);
                    alertRef.current.show();
                  }
                });
              }}
            >
              Send
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
