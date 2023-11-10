import React, { useEffect, useRef, useState } from "react";
import NavBar from "components/page_components/NavBar";
import CourseCard from "components/page_components/CourseCard";
import CourseDataMock_archived from "mock_data/DashboardPage/CourseDataMock_archived.json";
import QuizDataMock_available from "mock_data/DashboardPage/QuizDataMock_available.json";
import QuizDataMock_upcoming from "mock_data/DashboardPage/QuizDataMock_upcoming.json";
import QuizCard from "components/page_components/QuizCard";
import Accordion from "components/elements/Accordion";
import Toast from "components/elements/Toast";
import CourseEnrollModal from "components/page_components/CourseEnrollModal";
import CourseAccentColorModal from "components/page_components/CourseAccentColorModal";
import CourseDropModal from "components/page_components/CourseDropModal";
import { isStudentUserType } from "utils/CookieUtils";
import CourseCreateModal from "components/page_components/CourseCreateModal";
import {
  updateAccentColor,
  dropCourse,
  fetchEnrolledCourses,
  fetchInstructedCourses,
} from "api/CourseApi";
import AccessCodeUpdateModal from "components/page_components/AccessCodeUpdateModal";
import { useLocation, useNavigate } from "react-router-dom";

/* -- API function calls -- */

function getArchivedCourses() {
  return CourseDataMock_archived.courseList;
}

function getAvailableQuizzes() {
  return QuizDataMock_available.quizList;
}

function getUpcomingQuizzes() {
  return QuizDataMock_upcoming.quizList;
}

async function fetchData() {
  if (isStudentUserType()) {
    return fetchEnrolledCourses();
  } else {
    return fetchInstructedCourses();
  }
}

/* -- React Component -- */

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const quizSectionRef = useRef(null);
  const courseSectionRef = useRef(null);
  const isStudent = isStudentUserType();

  const [activeCourseList, activeCourseListSet] = useState([]);
  const [selectedTab, _setSelectedTab] = useState(
    localStorage.getItem("selected_tab") ?? "quizzes"
  );
  const [enrollModalShow, enrollModalShowSet] = useState(false);
  const [accentColorModalShow, accentColorModalShowSet] = useState(false);
  const [courseDropModalShow, courseDropModalShowSet] = useState(false);
  const [courseCreateModalShow, courseCreateModalShowSet] = useState(false);
  const [accessCodeUpdateModalShow, accessCodeUpdateModalShowSet] =
    useState(false);
  const [targetCourseObject, targetCourseObjectSet] = useState();
  const [toastMessage, toastMessageSet] = useState();

  function setSelectedTab(selection) {
    _setSelectedTab(selection);
    localStorage.setItem("selected_tab", selection);
    if (selection === "quizzes") {
      quizSectionRef.current.classList.remove("hidden");
      courseSectionRef.current.classList.add("hidden");
    } else {
      quizSectionRef.current.classList.add("hidden");
      courseSectionRef.current.classList.remove("hidden");
    }
  }

  function refetchDataAndShowToast(successMessage) {
    fetchData().then((fetchedPayload) => {
      activeCourseListSet(fetchedPayload);
      toastMessageSet(successMessage);
      setTimeout(() => {
        toastMessageSet();
      }, 3000);
    });
  }

  useEffect(() => {
    setSelectedTab(selectedTab);
    fetchData().then((fetchedPayload) => {
      activeCourseListSet(fetchedPayload);
      document.querySelector("main").classList.remove("hidden");
      const { passInMessage } = location.state ?? "";
      if (passInMessage) {
        toastMessageSet(passInMessage);
        navigate("", {});
        setTimeout(() => {
          toastMessageSet();
        }, 3000);
      }
    });
  }, [activeCourseListSet, toastMessageSet, location, navigate]);

  return (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <CourseEnrollModal
        enrollModalShow={enrollModalShow}
        enrollModalShowSet={enrollModalShowSet}
        onSuccess={(courseCode, courseSemester) => {
          const successMessage = `${courseCode} ${courseSemester} has been added to your course list`;
          refetchDataAndShowToast(successMessage);
          refetchDataAndShowToast(successMessage);
        }}
      />
      <CourseCreateModal
        modalShow={courseCreateModalShow}
        modalShowSet={courseCreateModalShowSet}
        onSuccess={(courseCode, courseSemester) => {
          const successMessage = `${courseCode} ${courseSemester} has been created`;
          refetchDataAndShowToast(successMessage);
          refetchDataAndShowToast(successMessage);
        }}
      />
      {targetCourseObject && (
        <CourseAccentColorModal
          courseObject={targetCourseObject}
          updateAccentColor={updateAccentColor}
          onSuccess={() => {
            const successMessage = `New accent color has been set for ${targetCourseObject.courseCode} ${targetCourseObject.courseSemester}`;
            refetchDataAndShowToast(successMessage);
          }}
          modalShow={accentColorModalShow}
          modalShowSet={accentColorModalShowSet}
        />
      )}

      {targetCourseObject && (
        <CourseDropModal
          modalShow={courseDropModalShow}
          modalShowSet={courseDropModalShowSet}
          courseObject={targetCourseObject}
          dropCourse={dropCourse}
          onSuccess={() => {
            const successMessage = `${targetCourseObject.courseCode} ${targetCourseObject.courseSemester} has been removed from your course list`;
            refetchDataAndShowToast(successMessage);
          }}
        />
      )}
      {targetCourseObject && (
        <AccessCodeUpdateModal
          modalShow={accessCodeUpdateModalShow}
          modalShowSet={accessCodeUpdateModalShowSet}
          courseObject={targetCourseObject}
          onSuccess={(newAccessCode) => {
            const successMessage = `Access code for ${targetCourseObject.courseCode} ${targetCourseObject.courseSemester} has been updated to ${newAccessCode}`;
            refetchDataAndShowToast(successMessage);
          }}
        />
      )}
      <NavBar
        additionalButtons={
          <button
            className="btn-outline py-0 text-sm w-28 h-8 sm:h-10 shrink-0"
            onClick={
              isStudent
                ? () => enrollModalShowSet(true)
                : () => {
                    courseCreateModalShowSet(true);
                  }
            }
          >
            {isStudent ? "Add course" : "Create course"}
          </button>
        }
      />
      <div className="min-h-screen w-full bg-gray-100">
        <main className="h-full px-8 gap-y-8 gap-x-[4%] md:px-24 w-full flex flex-col lg:flex-row py-32 sm:py-36 hidden">
          <div className="flex lg:hidden bg-gray-200 rounded-lg w-full justify-between">
            <label className="cursor-pointer w-[49%]">
              <input
                type="radio"
                name="tab"
                className="hidden peer"
                checked={selectedTab === "quizzes"}
                onChange={() => setSelectedTab("quizzes")}
              />
              <div className="rounded-lg p-2 text-sm peer-checked:font-medium text-center  peer-checked:bg-white text-slate-600 peer-checked:border peer-checked:shadow-sm w-full">
                Quizzes
              </div>
            </label>
            <label className="cursor-pointer w-[49%]">
              <input
                type="radio"
                id="courses"
                name="tab"
                className="hidden peer"
                checked={selectedTab === "courses"}
                onChange={() => setSelectedTab("courses")}
              />
              <div className="rounded-lg p-2 text-sm peer-checked:font-medium text-center  peer-checked:bg-white text-slate-600 peer-checked:border peer-checked:shadow-sm w-full">
                Courses
              </div>
            </label>
          </div>

          {/* --- Quiz Section --- */}
          <div
            ref={quizSectionRef}
            className="lg:w-[35%] flex flex-col gap-8 lg:flex"
          >
            <Accordion
              sectionName="Available Quizzes"
              content={
                <div className="flex flex-col gap-4 lg:gap-6">
                  {getAvailableQuizzes().map((quizObject, idx) => {
                    return <QuizCard quizObject={quizObject} key={idx} />;
                  })}
                </div>
              }
            />
            <Accordion
              sectionName="Upcoming Quizzes"
              content={
                <div className="flex flex-col gap-4 lg:gap-6">
                  {getUpcomingQuizzes().map((quizObject, idx) => {
                    return <QuizCard quizObject={quizObject} key={idx} />;
                  })}
                </div>
              }
            />
          </div>

          {/* --- Course Section --- */}
          <div
            ref={courseSectionRef}
            className="hidden flex flex-col gap-8 lg:flex lg:w-[65%]"
          >
            <Accordion
              sectionName={"Active Courses"}
              content={
                <div className="flex flex-wrap gap-x-[4%] gap-y-6 md:gap-y-8">
                  {activeCourseList.map((courseObject, idx) => {
                    return (
                      <CourseCard
                        courseObject={courseObject}
                        targetCourseObjectSet={targetCourseObjectSet}
                        accentColorModalShowSet={accentColorModalShowSet}
                        courseDropModalShowSet={courseDropModalShowSet}
                        accessCodeUpdateModalShowSet={
                          accessCodeUpdateModalShowSet
                        }
                        key={idx}
                      />
                    );
                  })}
                </div>
              }
            />
            <Accordion
              collapsed
              sectionName={"Archived Courses"}
              content={
                <div className="flex flex-wrap gap-x-[4%] gap-y-6 md:gap-y-8">
                  {getArchivedCourses().map((courseObject, idx) => {
                    return (
                      <CourseCard courseObject={courseObject} key={idx} />
                    );
                  })}
                </div>
              }
            />
          </div>
        </main>
      </div>
    </>
  );
}
