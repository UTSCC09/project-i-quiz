import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Badge from "components/elements/Badge";
import NavBar from "components/page_components/NavBar";
import DropdownMenu from "components/elements/DropdownMenu";
import { isStudentUserType } from "utils/CookieUtils";
import Toast from "components/elements/Toast";
import { fetchCourseObject } from "api/CourseApi";
import { getQuiz } from "api/QuizApi";
import { AdjustmentsIcon, PenIcon } from "components/elements/SVGIcons";
import colors from "tailwindcss/colors";
import {
  createQuizReponse,
  // generateQuizPDF,
  getQuizResponse,
} from "api/QuizResponseApi";

export default function QuizInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams();
  const { passInCourseObject } = useState() ?? {};
  const [courseObject, courseObjectSet] = useState(passInCourseObject ?? null);
  const [quizObject, quizObjectSet] = useState();

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
      <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-36">
        <main className="h-fit flex flex-col md:px-24 px-8 w-full lg:w-[64rem]">
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
        </main>
      </div>
    </>
  );
}
