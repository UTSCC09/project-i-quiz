import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Badge from "components/elements/Badge";
import NavBar from "components/page_components/NavBar";
import DropdownMenu from "components/elements/DropdownMenu";
import { isStudentUserType } from "utils/CookieUtils";
import Toast from "components/elements/Toast";
import { fetchCourseObject } from "api/CourseApi";
import {
  getQuiz,
  releaseQuizGrades,
} from "api/QuizApi";
import { createQuizReponse, getQuizResponse } from "api/QuizResponseApi";
import {
  AdjustmentsIcon,
  DocumentCheckIcon,
  DocumentIcon,
  EnvelopeIcon,
  PenIcon,
  Spinner,
} from "components/elements/SVGIcons";
import colors from "tailwindcss/colors";
import Modal from "components/elements/Modal";
import AlertBanner from "components/elements/AlertBanner";
import { generateStudentQuizPDF } from "api/QuizResponseApi";
import { generateInstructorQuizPDF } from "api/QuizApi";

export default function QuizInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams();
  const alertRef = useRef();
  const isStudent = isStudentUserType();

  const { passInCourseObject } = useState() ?? {};
  const [courseObject, courseObjectSet] = useState(passInCourseObject ?? null);
  const [quizObject, quizObjectSet] = useState();
  const [gradeReleaseModalShow, gradeReleaseModalShowSet] = useState();
  const [toastMessage, toastMessageSet] = useState();
  const [isLoading, isLoadingSet] = useState(true);
  const [studentQuizCase, studentQuizCaseSet] = useState();

  let quizOptions = [];
  if (!isStudent){
    quizOptions.push( {
      label: "Download as PDF",
      onClick: () => {
        generateInstructorQuizPDF(quizId);
      },
    });
  } else {
    quizOptions.push( {
      label: "Download as PDF",
      onClick: () => {
        generateStudentQuizPDF(quizId);
      },
    });
  }

  const onStartQuiz = () => {
    const questionResponses = quizObject.questions.map((question) => {
      return {
        question: question._id,
        response: [""],
      };
    });
    isLoadingSet(true);
    createQuizReponse(quizId, questionResponses).then((payload) => {
      if (payload) {
        navigate("/quiz/" + quizId);
      } else {
        alert("Failed to create blank quiz response");
      }
      isLoadingSet(false);
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

    isLoadingSet(true);
    getQuiz(quizId).then((quizObject) => {
      quizObjectSet(quizObject);
      fetchCourseObject(quizObject.courseId).then((result) => {
        courseObjectSet(result.payload);
        if (isStudent) {
          const quizState = getQuizState(quizObject);

          if (quizState === "pending" || quizState === "upcoming") {
            studentQuizCaseSet("invalid");
          } else {
            getQuizResponse(quizId).then((result) => {
              //case 1: no response found
              if (
                !result.success &&
                result.message === "No response found for this quiz"
              ) {
                //subcase 1: quiz is closed
                if (quizState === "closed") {
                  studentQuizCaseSet("missed");
                } else {
                  //subcase 2: quiz is available
                  studentQuizCaseSet("canStart");
                }
              }
              //case 2: response found, but not submitted
              else if (
                result.success &&
                result.payload.status !== "submitted"
              ) {
                //subcase 1: quiz is closed
                if (quizState === "closed") {
                  studentQuizCaseSet("missed");
                } else {
                  //subcase 2: quiz is available
                  studentQuizCaseSet("canContinue");
                }
              }
              //case 3: response found, and submitted
              //subcase 1: quiz grade not released
              else if (
                !result.success &&
                result.message === "Quiz grades not released yet"
              ) {
                studentQuizCaseSet("notGraded");
              }
              //subcase 2: quiz grade released
              else if (
                result.success &&
                result.payload.status === "submitted"
              ) {
                //Assume grade released due to backned logic
                studentQuizCaseSet("graded");
              }
              //case 4: error
              else {
                console.error(result.message);
                alert("Failed to fetch quiz response");
              }
              isLoadingSet(false);
            });
          }
        }
        isLoadingSet(false);
      });
    });
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
                  onClick={(e) => {
                    e.preventDefault();
                    alertRef.current.hide();
                    /* TODO: add API call*/
                    releaseQuizGrades(quizId).then((result) => {
                      console.log(quizObject);
                      if (result.success) {
                        gradeReleaseModalShowSet(false);
                        quizObjectSet((prev) => {
                          return {
                            ...prev,
                            isGradeReleased: true,
                          };
                        });
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
                  {isLoading ? <Spinner className="-mt-1" /> : "Confirm"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => gradeReleaseModalShowSet(false)}
                >
                  {isLoading ? <Spinner className="-mt-1" /> : "Cancel"}
                </button>
              </div>
            </div>
          }
        />
      )}
      <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-36">
        <main className="h-fit flex flex-col md:px-24 px-8 w-full lg:w-[64rem]">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between mb-6 md:mb-8">
            <div className="flex flex-col pr-4 h-24 justify-end">
              {quizObject && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-bold text-3xl md:text-4xl mb-1 max-w-full line-clamp-2 text-ellipsis break-words">
                    {quizObject.quizName}
                  </span>
                  {isStudent &&
                    (studentQuizCase === "canStart" ||
                      studentQuizCase === "canContinue") && (
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
                  {isStudent
                    ? (studentQuizCase === "invalid" && (
                        <h1 className="text-red-500 text-sm ml-0.5">
                          YOU SHOULD NOT BE HERE!!
                        </h1>
                      )) ||
                      (studentQuizCase === "missed" && (
                        <Badge
                          iconId={"missed"}
                          label={"Missed"}
                          accentColor={colors.red[500]}
                        />
                      )) ||
                      (studentQuizCase === "canContinue" && (
                        <Badge
                          iconId={"writing"}
                          label={"Writing"}
                          accentColor={colors.gray[500]}
                        />
                      )) ||
                      (studentQuizCase === "notGraded" && (
                        <>
                          <Badge
                            iconId={"submitted"}
                            label={"Submitted"}
                            accentColor={colors.green[500]}
                          />
                          <Badge
                            iconId={"gradingInPrg"}
                            label={"Not Graded"}
                            accentColor={colors.gray[500]}
                          />
                        </>
                      )) ||
                      (studentQuizCase === "graded" && (
                        <Badge
                          iconId={"graded"}
                          label={"Graded"}
                          accentColor={colors.blue[600]}
                        />
                      ))
                    : quizObject.isDraft && (
                        <Badge
                          iconId={"writing"}
                          label={"Draft"}
                          accentColor={colors.gray[500]}
                        />
                      )}
                  {/* {!isStudent && quizObject.isDraft && (
                    <Badge
                      iconId={"writing"}
                      label={"Draft"}
                      accentColor={colors.gray[500]}
                    />
                  )}
                  {isStudent && studentQuizCase === "canContinue" && (
                    <Badge
                      iconId={"writing"}
                      label={"Writing"}
                      accentColor={colors.gray[500]}
                    />
                  )}
                  {isStudent && quizResponseStatus === "submitted" && (
                    <Badge
                      iconId={"submitted"}
                      label={"Submitted"}
                      accentColor={colors.green[500]}
                    />
                  )} */}
                </div>
              )}
              {courseObject && (
                <span className="text-gray-500 text-sm ml-0.5">
                  {courseObject.courseCode}: {courseObject.courseName}
                </span>
              )}
            </div>
            {isStudent && (
              <div className="flex gap-2 sm:gap-4 text-gray-700">
                <div className="flex gap-2 sm:gap-4">
                  <DropdownMenu
                    buttonElement={
                      <button className="bg-white shadow-sm h-8 sm:h-10 w-8 sm:w-10 text-center rounded-md border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all">
                        <AdjustmentsIcon className="h-[18px] sm:h-5" />
                      </button>
                    }
                    options={quizOptions}
                    menuAlignLeft
                  />
                </div>
              </div>
            )}
          </div>
          {/* Body */}
          {courseObject && quizObject && (
            <div className="flex flex-col gap-4">
              {isStudent ? (
                (studentQuizCase === "invalid" && (
                  <h1 className="text-red-500 text-sm ml-0.5">
                    YOU SHOULD NOT BE HERE!!
                  </h1>
                )) ||
                (studentQuizCase === "missed" && (
                  <p className="text-lg">
                    Seems like you missed the deadline for this quiz. Please
                    contact your instructor for more information.
                  </p>
                )) ||
                (studentQuizCase === "canStart" && (
                  <div className="flex gap-4 flex-col lg:flex-row">
                    <button
                      className="h-16 lg:h-24 gap-2 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                      style={{ "--accentColor": courseObject.accentColor }}
                      onClick={onStartQuiz}
                    >
                      {isLoading ? (
                        <Spinner className="-mt-1" />
                      ) : (
                        <>
                          <PenIcon className="h-3" />
                          <span>Start Quiz</span>
                        </>
                      )}
                    </button>
                  </div>
                )) ||
                (studentQuizCase === "canContinue" && (
                  <div className="flex gap-4 flex-col lg:flex-row">
                    <Link
                      to={"/quiz/" + quizId}
                      className="h-16 lg:h-24 gap-2 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                      style={{ "--accentColor": courseObject.accentColor }}
                    >
                      <PenIcon className="h-3" />
                      <span>Continue Writing</span>
                    </Link>
                  </div>
                )) ||
                (studentQuizCase === "notGraded" && (
                  <p className="text-lg">
                    Your instructor is working on the grades. Please check back
                    later.
                  </p>
                )) ||
                (studentQuizCase === "graded" && (
                  <p className="text-lg">Your quiz grade.</p>
                ))
              ) : quizObject.isDraft ? (
                <Link
                  to={"/quiz/" + quizId}
                  className="h-16 lg:h-24 gap-2 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                  style={{ "--accentColor": courseObject.accentColor }}
                >
                  <PenIcon className="h-3" />
                  <span>Edit Draft</span>
                </Link>
              ) : (
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
                      {isLoading ? (
                        <Spinner className="-mt-1" />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            pointerEvents: quizObject.isGradeReleased
                              ? "none"
                              : "auto",
                            opacity: quizObject.isGradeReleased ? 0.5 : 1,
                          }}
                        >
                          <EnvelopeIcon className="h-5" />
                          <span>Release Grades</span>
                        </div>
                      )}
                    </button>
                  </div>
                  <Link
                    to={"/mark-quiz/" + quizId}
                    className="h-16 lg:h-24 gap-3 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                    style={{ "--accentColor": courseObject.accentColor }}
                  >
                    <DocumentCheckIcon className="h-5" />
                    <span>Mark Student Responses</span>
                  </Link>
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

              {/* {isStudent && studentQuizCase === "canStart" && (
                <div className="flex gap-4 flex-col lg:flex-row">
                  <button
                    className="h-16 lg:h-24 gap-2 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                    style={{ "--accentColor": courseObject.accentColor }}
                    onClick={onStartQuiz}
                  >
                    <PenIcon className="h-3" />
                    <span>Start Quiz</span>
                  </button>
                </div>
              )}
              {isStudent && studentQuizCase === "canContinue" && (
                <div className="flex gap-4 flex-col lg:flex-row">
                  <Link
                    to={"/quiz/" + quizId}
                    className="h-16 lg:h-24 gap-2 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                    style={{ "--accentColor": courseObject.accentColor }}
                  >
                    <PenIcon className="h-3" />
                    <span>Continue Writing</span>
                  </Link>
                </div>
              )}
              {!isStudent && quizObject.isDraft && (
                <Link
                  to={"/quiz/" + quizId}
                  className="h-16 lg:h-24 gap-2 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                  style={{ "--accentColor": courseObject.accentColor }}
                >
                  <PenIcon className="h-3" />
                  <span>Edit Draft</span>
                </Link>
              )}
              {!isStudent && !quizObject.isDraft && (
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
                      <span>Release Grades</span>
                    </button>
                  </div>
                  <Link
                    to={"/mark-quiz/" + quizId}
                    className="h-16 lg:h-24 gap-3 flex shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full hover:bg-gray-100 hover:border hover:border-[--accentColor] transition font-medium text-gray-700 hover:text-[--accentColor]"
                    style={{ "--accentColor": courseObject.accentColor }}
                  >
                    <DocumentCheckIcon className="h-5" />
                    <span>Mark Student Responses</span>
                  </Link>
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
              )} */}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function getQuizState(quizObject) {
  const startTime = new Date(quizObject.startTime);
  const endTime = new Date(quizObject.endTime);
  const currentTime = new Date();

  if (quizObject.isDraft) {
    return "pending";
  } else if (startTime > currentTime) {
    return "upcoming";
  } else if (endTime >= currentTime) {
    return "available";
  } else {
    return "closed";
  }
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
    <div className="h-36 lg:h-44 gap-2 flex flex-col shadow-sm bg-white rounded-md px-12 border items-center justify-center w-full transition">
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
    </div>
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
