import { getQuiz } from "api/QuizApi";
import {
  createQuizRemark,
  getAllQuizRemarks,
  getRemarkInfoForInstructor,
  getRemarkInfoForStudent,
  resolveQuizRemark,
} from "api/QuizRemarkApi";
import { getQuizResponse } from "api/QuizResponseApi";
import AlertBanner from "components/elements/AlertBanner";
import Badge from "components/elements/Badge";
import Modal from "components/elements/Modal";
import { Spinner } from "components/elements/SVGIcons";
import SingleLineInput from "components/elements/SingleLineInput";
import Toast from "components/elements/Toast";
import NavBar from "components/page_components/NavBar";
import QuestionWrapper from "components/question_components/QuestionWrapper";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import colors from "tailwindcss/colors";

export default function RemarkPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [regradeModalShow, regradeModalShowSet] = useState(false);
  const [isLoading, isLoadingSet] = useState(false);
  const [toastMessage, toastMessageSet] = useState();
  const [remarks, remarksSet] = useState([]);
  const [resolvedRemarks, resolvedRemarksSet] = useState([]);
  const alertRef = useRef();
  const questionIdForRegradeRef = useRef();
  const studentCommentRef = useRef();
  const scoreInputRef = useRef();
  const location = useLocation();

  useEffect(() => {
    getAllQuizRemarks(quizId).then((result) => {
      if (result.success) {
        remarksSet(result.payload.filter((item) => item.status === "pending"));
        resolvedRemarksSet(
          result.payload.filter((item) => item.status === "resolved")
        );
      }
    });
  }, [quizId]);

  useEffect(() => {
    const { passInMessage } = location.state ?? "";
    if (passInMessage) {
      toastMessageSet(passInMessage);
      setTimeout(() => {
        toastMessageSet();
      }, 3000);
    }
  }, [location.state, navigate, quizId, toastMessageSet]);

  return (
    <>
      <NavBar />
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <div className="min-h-screen w-full flex justify-center py-28 sm:py-36 bg-gray-100">
        <div className="px-4 md:px-24 w-full lg:w-[64rem] flex flex-col gap-4 sm:gap-8 text-gray-800">
          {remarks.concat(resolvedRemarks).map((remark) => {
            return (
              <div
                key={remark._id}
                className="flex flex-col rounded-md border border-blue-600 px-12 py-12 text-sm gap-4 bg-white shadow"
              >
                <Badge
                  label={remark.status}
                  className={"capitalize"}
                  accentColor={
                    remark.status === "resolved"
                      ? colors.green[600]
                      : colors.yellow[500]
                  }
                />
                <div className="font-medium">Student comment:</div>
                <div className="text-base">{remark.studentComment}</div>
                <div className="font-medium">Instructor comment:</div>
                {remark.status === "resolved" ? (
                  <div>{remark.instructorComment}</div>
                ) : (
                  <>
                    <SingleLineInput
                      ref={scoreInputRef}
                      label="New Score"
                      inputType="number"
                    />
                    <textarea
                      placeholder="Your comment"
                      ref={studentCommentRef}
                      className="simple-input h-36 px-4"
                    />
                    <button
                      className="btn-primary"
                      onClick={() => {
                        resolveQuizRemark(
                          remark._id,
                          scoreInputRef.current.getValue(),
                          studentCommentRef.current.value
                        ).then((result) => {
                          console.log(studentCommentRef.current.value);
                          if (result && result.success) {
                            window.location.reload();
                          } else {
                            toastMessageSet(result.message);
                          }
                        });
                      }}
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
