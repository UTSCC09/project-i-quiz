import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Badge from "components/elements/Badge";
import NavBar from "components/page_components/NavBar";
import DropdownMenu from "components/elements/DropdownMenu";
import { isStudentUserType } from "utils/CookieUtils";
import Toast from "components/elements/Toast";
import { fetchCourseObject } from "api/CourseApi";
import { getQuiz } from "api/QuizApi";
import {
  AdjustmentsIcon,
  DocumentIcon,
  EnvelopeIcon,
  PenIcon,
} from "components/elements/SVGIcons";
import colors from "tailwindcss/colors";
import {
  createQuizReponse,
  // generateQuizPDF,
  getQuizResponse,
} from "api/QuizResponseApi";
import Modal from "components/elements/Modal";
import AlertBanner from "components/elements/AlertBanner";

export default function QuizInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams();
  const { passInCourseObject } = useState() ?? {};
  const [courseObject, courseObjectSet] = useState(passInCourseObject ?? null);
  const [quizObject, quizObjectSet] = useState();
  const [gradeReleaseModalShow, gradeReleaseModalShowSet] = useState();
  const alertRef = useRef();

  const [toastMessage, toastMessageSet] = useState();

  const isStudent = isStudentUserType();

  let quizOptions = [
    {
      label: "Download as PDF",
      onClick: () => {
        // generateQuizPDF(quizId);
      },
    },
  ];
  const [quizResponseStatus, quizResponseStatusSet] = useState(false);

  const onStartQuiz = () => {
    const questionResponses = quizObject.questions.map((question) => {
      return {
        question: question._id,
        response: [""],
      };
    });
    createQuizReponse(quizId, questionResponses).then((payload) => {
      if (payload) {
        navigate("/quiz/" + quizId);
      } else {
        alert("Failed to create blank quiz response");
      }
    });
  };

  useEffect(() => {
    const { passInMessage } = location.state ?? "";
    if (passInMessage) {
      toastMessageSet(passInMessage);
      navigate("", {});
      setTimeout(() => {
        toastMessageSet();
      }, 3000);
    }

    getQuiz(quizId).then((quizPayload) => {
      quizObjectSet(quizPayload);
      fetchCourseObject(quizPayload.courseId).then((result) => {
        courseObjectSet(result.payload);
      });
    });

    if (isStudent) {
      getQuizResponse(quizId).then((result) => {
        if (
          !result.success &&
          result.message === "No response found for this quiz"
        ) {
          getQuiz(quizId).then((payload) => {
            quizObjectSet(payload);
          });
        } else if (result.success) {
          quizResponseStatusSet(result.payload.status);
        } else {
          console.error(result.message);
          alert("Failed to fetch quiz response");
        }
      });
    }
  }, [isStudent, location.state, navigate, quizId, toastMessageSet]);

  return (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <NavBar />
      {courseObject && (
        <Modal
          modalShow={gradeReleaseModalShow}
          modalShowSet={gradeReleaseModalShowSet}
          content={
            <div className="flex flex-col sm:w-96 gap-6">
              <h1 className="text-2xl font-bold">Releasing grades</h1>
              <AlertBanner ref={alertRef} />
              <div className="flex flex-col gap-4 text-gray-600">
                <span>
                  Are you sure you want to release grades for{" "}
                  <b>{quizObject.quizName}</b> in{" "}
                  <b>
                    {courseObject.courseCode} {courseObject.courseSemester}
                  </b>{" "}
                  to all enrolled students?
                </span>
                <span>
                  Each student will get an email of their own grade of this
                  quiz.
                </span>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  className="btn-primary"
                  onClick={() => {
                    alertRef.current.hide();
                    /* TODO: add API call*/
                    (async () => {}).then((result) => {
                      if (result.success) {
                        gradeReleaseModalShowSet(false);
                        toastMessageSet(
                          "The grades have been released to your students"
                        );
                        setTimeout(() => {
                          toastMessageSet();
                        }, 3000);
                      } else {
                        alertRef.current.setMessage(
                          "Cannot release grades: " + result.message
                        );
                        alertRef.current.show();
                      }
                    });
                  }}
                >
                  Confirm
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => gradeReleaseModalShowSet(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          }
        />
      )}
      <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-36">
        <main className="h-fit flex flex-col md:px-24 px-8 w-full lg:w-[64rem]">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between mb-6 md:mb-8 h-28 sm:h-16">
            <div className="flex flex-col pr-4">
              {quizObject && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-bold text-3xl md:text-4xl mb-1">
                    {quizObject.quizName}
                  </span>
                  {isStudent && quizResponseStatus !== "submitted" && (
                    <div className="w-2 h-2 shrink-0 rounded-full bg-red-500"></div>
                  )}
                  {courseObject && (
                    <Badge
                      label={
                        courseObject.courseCode +
                        " · " +
                        courseObject.courseSemester
                      }
                      accentColor={courseObject.accentColor}
                    />
                  )}
                  {((isStudent && quizResponseStatus === "writing") ||
                    (!isStudent && quizObject.isDraft)) && (
                    <Badge
                      iconId={"writing"}
                      label={"Draft"}
                      accentColor={colors.gray[500]}
                    />
                  )}
                  {isStudent && quizResponseStatus === "submitted" && (
                    <Badge
                      iconId={"submitted"}
                      label={"Submitted"}
                      accentColor={colors.green[500]}
                    />
                  )}
                </div>
              )}
              {courseObject && (
                <span className="text-gray-500 text-sm ml-0.5">
                  {courseObject.courseCode}: {courseObject.courseName}
                </span>
              )}
            </div>
            <div className="flex gap-2 sm:gap-4 text-gray-700">
              <div className="flex gap-2 sm:gap-4">
                {!isStudent && quizObject && quizObject.isDraft && (
                  <Link
                    to={"/quiz/" + quizId}
                    className="bg-white shadow-sm h-8 sm:h-10 w-8 sm:w-10 text-center rounded-md border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all"
                  >
                    <PenIcon className="h-3" />
                  </Link>
                )}
                <DropdownMenu
                  buttonElement={
                    <button className="bg-white shadow-sm h-8 sm:h-10 w-8 sm:w-10 text-center rounded-md border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all">
                      <AdjustmentsIcon className="h-[18px] sm:h-5" />
                    </button>
                  }
                  options={quizOptions}
                  menuAlignLeft
                />
                {isStudent && !quizResponseStatus && (
                  <button
                    className="bg-white shadow-sm font-semibold h-8 sm:h-10 px-4 text-sm text-center rounded-md border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all"
                    onClick={onStartQuiz}
                  >
                    Start Quiz
                  </button>
                )}
                {isStudent && quizResponseStatus === "writing" && (
                  <Link
                    to={"/quiz/" + quizId}
                    className="bg-white shadow-sm font-semibold h-8 sm:h-10 px-4 text-sm text-center rounded-md border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all"
                  >
                    Continue Quiz
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* Body */}
          {courseObject && quizObject && (
            <div className="flex flex-col gap-4">
              {!isStudent && quizObject && !quizObject.isDraft && (
                <>
                  <div className="flex gap-4 flex-col lg:flex-row">
                    <Link
                      to={"/quiz/" + quizId}
                      className="h-16 lg:h-24 gap-2 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                      style={{ "--accentColor": courseObject.accentColor }}
                    >
                      <DocumentIcon className="h-5" />
                      <span>View Quiz</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => gradeReleaseModalShowSet(true)}
                      className="h-16 lg:h-24 gap-3 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                      style={{ "--accentColor": courseObject.accentColor }}
                    >
                      <EnvelopeIcon className="h-5" />
                      <span>Release grades to all students</span>
                    </button>
                  </div>
                  <div className="flex gap-4 flex-col lg:flex-row">
                    <SubmissionCountCard
                      accentColor={courseObject.accentColor}
                      numReceived={10}
                      numTotal={78}
                    />
                    <MarkingProgressCard
                      accentColor={courseObject.accentColor}
                      quizId={quizId}
                      numMarked={1}
                      numTotal={10}
                    />
                    <GradeStatsCard
                      accentColor={courseObject.accentColor}
                      averagePercentage={63}
                      medianPercentage={72}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function MarkingProgressCard({
  accentColor,
  numMarked = 0,
  numTotal = 0,
  quizId,
}) {
  return (
    <Link
      to={"/mark-quiz/" + quizId}
      className="h-36 lg:h-44 gap-2 flex flex-col shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition"
      style={{ "--accentColor": accentColor }}
    >
      <div className="w-full text-sm text-gray-700 font-medium inline-flex gap-2 items-center -pl-5">
        <div
          className="w-1.5 h-3.5"
          style={{ backgroundColor: accentColor }}
        ></div>
        Marking Progress
      </div>
      <div className="flex gap-1 items-end">
        <span
          className="text-xs font-bold text-gray-500 mb-0.5 opacity-70"
          style={{ color: accentColor }}
        >
          MARKED
        </span>
        <span
          className="text-3xl tracking-tight font-bold"
          style={{ color: accentColor }}
        >
          {numMarked}
        </span>
        <span className="text-2xl mx-1 font-thin">/</span>
        <span className="text-xs font-bold text-gray-500 mb-0.5">TOTAL</span>
        <span className="text-3xl tracking-tight font-bold">{numTotal}</span>
      </div>
    </Link>
  );
}

function SubmissionCountCard({ accentColor, numReceived = 0, numTotal = 0 }) {
  return (
    <Link
      className="h-36 lg:h-44 gap-2 flex flex-col shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition"
      style={{ "--accentColor": accentColor }}
    >
      <div className="w-full text-sm text-gray-700 font-medium inline-flex gap-2 items-center -pl-5">
        <div
          className="w-1.5 h-3.5"
          style={{ backgroundColor: accentColor }}
        ></div>
        Submission Count
      </div>
      <div className="text-3xl">
        <b style={{ color: accentColor }}>{numReceived}</b>
        <span className="mx-2 font-thin">/</span>
        <b>{numTotal}</b>
      </div>
    </Link>
  );
}

function GradeStatsCard({
  accentColor,
  averagePercentage = 0,
  medianPercentage = 0,
}) {
  return (
    <Link
      className="h-36 lg:h-44 gap-2 flex flex-col shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition"
      style={{ "--accentColor": accentColor }}
    >
      <div className="w-full text-sm text-gray-700 font-medium inline-flex gap-2 items-center -pl-5">
        <div
          className="w-1.5 h-3.5"
          style={{ backgroundColor: accentColor }}
        ></div>
        Grade Statistics
      </div>
      <div className="flex gap-4 font-semibold">
        {averagePercentage && medianPercentage ? (
          <div className="flex gap-1 items-end">
            <span className="text-xs font-bold text-gray-500 mb-0.5">
              AVG.
            </span>
            <span className="text-3xl tracking-tight font-bold">
              {averagePercentage}
            </span>
            %
            <span className="text-xs font-bold text-gray-500 mb-0.5 ml-2">
              MED.
            </span>
            <span className="text-3xl tracking-tight font-bold">
              {medianPercentage}
            </span>
            %
          </div>
        ) : (
          <span className="text-2xl tracking-tight font-semibold text-gray-400">
            Not graded yet
          </span>
        )}
      </div>
    </Link>
  );
}
