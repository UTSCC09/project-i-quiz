import React, { useEffect, useRef, useState } from "react";
import NavBar from "components/page_components/NavBar";
import CourseCard from "components/page_components/CourseCard";
import QuizCard from "components/page_components/QuizCard";
import Accordion from "components/elements/Accordion";
import Toast from "components/elements/Toast";
import CourseEnrollModal from "components/page_components/CourseEnrollModal";
import CourseAccentColorModal from "components/page_components/CourseAccentColorModal";
import CourseArchiveModal from "components/page_components/CourseArchiveModal";
import CourseDropModal from "components/page_components/CourseDropModal";
import QuizInviteModal from "components/page_components/QuizInviteModal";
import { isStudentUserType } from "utils/CookieUtils";
import CourseCreateModal from "components/page_components/CourseCreateModal";
import {
  updateAccentColor,
  archiveCourse,
  dropCourse,
  fetchEnrolledCourses,
  fetchInstructedCourses,
} from "api/CourseApi";
import AccessCodeUpdateModal from "components/page_components/AccessCodeUpdateModal";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuizzesForDashboard } from "api/QuizApi";

/* -- API function calls -- */

async function fetchCourses() {
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

  const [activeCourseList, activeCourseListSet] = useState();
  const [archivedCourseList, archivedCourseListSet] = useState();

  const [activeQuizList, activeQuizListSet] = useState();
  const [upcomingQuizList, upcomingQuizListSet] = useState();

  const [selectedTab, _setSelectedTab] = useState(
    localStorage.getItem("selected_tab") ?? "quizzes"
  );
  const [enrollModalShow, enrollModalShowSet] = useState(false);
  const [accentColorModalShow, accentColorModalShowSet] = useState(false);
  const [courseArchiveModalShow, courseArchiveModalShowSet] = useState(false);
  const [courseDropModalShow, courseDropModalShowSet] = useState(false);
  const [courseCreateModalShow, courseCreateModalShowSet] = useState(false);
  const [quizInviteModalShow, quizInviteModalShowSet] = useState(false);
  const [accessCodeUpdateModalShow, accessCodeUpdateModalShowSet] =
    useState(false);
  const [targetCourseObject, targetCourseObjectSet] = useState({});
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
    fetchCourses().then((fetchedPayload) => {
      if (fetchedPayload) {
        activeCourseListSet(
          fetchedPayload.filter((course) => course.archived === false)
        );
        archivedCourseListSet(
          fetchedPayload.filter((course) => course.archived === true)
        );
      }
      toastMessageSet(successMessage);
      setTimeout(() => {
        toastMessageSet();
      }, 3000);
    });

    getQuizzesForDashboard(
      "upcoming",
      isStudent ? "student" : "instructor"
    ).then((fetchedPayload) => {
      upcomingQuizListSet(fetchedPayload ?? []);
    });
    getQuizzesForDashboard("active", isStudent ? "student" : "instructor").then(
      (fetchedPayload) => {
        activeQuizListSet(fetchedPayload ?? []);
      }
    );
  }

  useEffect(() => {
    setSelectedTab(selectedTab);
    getQuizzesForDashboard(
      "upcoming",
      isStudent ? "student" : "instructor"
    ).then((fetchedPayload) => {
      upcomingQuizListSet(fetchedPayload ?? []);
      getQuizzesForDashboard(
        "active",
        isStudent ? "student" : "instructor"
      ).then((fetchedPayload) => {
        activeQuizListSet(fetchedPayload ?? []);
        fetchCourses().then((fetchedPayload) => {
          if (fetchedPayload) {
            activeCourseListSet(
              fetchedPayload.filter((course) => course.archived === false)
            );
            archivedCourseListSet(
              fetchedPayload.filter((course) => course.archived === true)
            );
          }
          const { passInMessage } = location.state ?? "";
          if (passInMessage) {
            toastMessageSet(passInMessage);
            navigate("", {});
            setTimeout(() => {
              toastMessageSet();
            }, 3000);
          }
        });
      });
    });
  }, [
    activeCourseListSet,
    archivedCourseListSet,
    toastMessageSet,
    location,
    navigate,
    selectedTab,
    isStudent,
  ]);

  return (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <CourseEnrollModal
        enrollModalShow={enrollModalShow}
        enrollModalShowSet={enrollModalShowSet}
        onSuccess={(payload) => {
          const successMessage = `${payload.courseCode} ${payload.courseSemester} has been added to your course list`;
          refetchDataAndShowToast(successMessage);
          enrollModalShowSet(false);
        }}
      />
      <CourseCreateModal
        modalShow={courseCreateModalShow}
        modalShowSet={courseCreateModalShowSet}
        onSuccess={(courseCode, courseSemester) => {
          const successMessage = `${courseCode} ${courseSemester} has been created`;
          refetchDataAndShowToast(successMessage);
        }}
      />
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
      <CourseArchiveModal
        modalShow={courseArchiveModalShow}
        modalShowSet={courseArchiveModalShowSet}
        courseObject={targetCourseObject}
        archiveCourse={archiveCourse}
        onSuccess={() => {
          const successMessage = `${targetCourseObject.courseCode} ${
            targetCourseObject.courseSemester
          } has been ${
            targetCourseObject.archived ? "unarchived" : "archived"
          }`;
          refetchDataAndShowToast(successMessage);
        }}
      />
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
      <AccessCodeUpdateModal
        modalShow={accessCodeUpdateModalShow}
        modalShowSet={accessCodeUpdateModalShowSet}
        courseObject={targetCourseObject}
        onSuccess={(newAccessCode) => {
          const successMessage = `Access code for ${targetCourseObject.courseCode} ${targetCourseObject.courseSemester} has been updated to ${newAccessCode}`;
          refetchDataAndShowToast(successMessage);
        }}
      />
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
        <main className="h-full px-8 gap-y-8 gap-x-[4%] md:px-24 w-full flex flex-col lg:flex-row py-32 sm:py-36">
          {/* Tab bar for mobile device */}
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
            {activeQuizList && upcomingQuizList ? (
              <>
                {activeQuizList.length === 0 &&
                  upcomingQuizList.length === 0 && (
                    <div className="bg-gray-200 px-6 sm:px-8 h-16 flex items-center rounded-md text-sm sm:text-base text-gray-600">
                      You have no quizzes
                    </div>
                  )}
                {activeQuizList.length !== 0 && (
                  <Accordion
                    sectionName="Available Quizzes"
                    content={
                      <div className="flex flex-col gap-4 lg:gap-6">
                        {activeQuizList.map((quizObject, idx) => {
                          console.log(quizObject);
                          return (
                            <>
                              <QuizInviteModal
                                modalShow={quizInviteModalShow}
                                modalShowSet={quizInviteModalShowSet}
                                quizObject={quizObject}
                              />
                              <QuizCard
                                accentColor={quizObject.accentColor}
                                quizObject={quizObject}
                                quizInviteModalShowSet={quizInviteModalShowSet}
                                key={idx}
                              />
                            </>
                          );
                        })}
                      </div>
                    }
                  />
                )}
                {upcomingQuizList.length !== 0 && (
                  <Accordion
                    sectionName="Upcoming Quizzes"
                    content={
                      <div className="flex flex-col gap-4 lg:gap-6">
                        {upcomingQuizList.map((quizObject, idx) => {
                          return (
                            <>
                              <QuizInviteModal
                                modalShow={quizInviteModalShow}
                                modalShowSet={quizInviteModalShowSet}
                                quizObject={quizObject}
                              />
                              <QuizCard
                                accentColor={quizObject.accentColor}
                                quizInviteModalShowSet={quizInviteModalShowSet}
                                quizObject={quizObject}
                                key={idx}
                              />
                            </>
                          );
                        })}
                      </div>
                    }
                  />
                )}
              </>
            ) : (
              <div className="animate-pulse w-full">
                <div className="bg-gray-200 h-6 rounded mb-4 w-32"></div>
                <div className="bg-gray-200 h-20 md:h-24 rounded mb-8"></div>
                <div className="bg-gray-200 h-6 rounded mb-4 w-32"></div>
                <div className="bg-gray-200 h-20 md:h-24 rounded mb-4"></div>
                <div className="bg-gray-200 h-20 md:h-24 rounded mb-4"></div>
                <div className="bg-gray-200 h-20 md:h-24 rounded mb-4"></div>
              </div>
            )}
          </div>

          {/* --- Course Section --- */}
          <div
            ref={courseSectionRef}
            className="hidden flex flex-col gap-8 w-full lg:flex lg:w-[65%]"
          >
            {activeCourseList && archivedCourseList ? (
              <>
                {activeCourseList.length === 0 &&
                  archivedCourseList.length === 0 && (
                    <div className="bg-gray-200 px-6 sm:px-8 h-16 flex items-center rounded-md text-sm sm:text-base text-gray-600">
                      You have no courses
                    </div>
                  )}
                {activeCourseList.length !== 0 && (
                  <Accordion
                    sectionName={"Active Courses"}
                    content={
                      <div className="flex flex-wrap gap-x-[4%] gap-y-6 md:gap-y-8">
                        {activeCourseList.map((courseObject, idx) => {
                          return (
                            <CourseCard
                              courseObject={courseObject}
                              zIndex={activeCourseList.length - idx}
                              targetCourseObjectSet={targetCourseObjectSet}
                              accentColorModalShowSet={accentColorModalShowSet}
                              courseArchiveModalShowSet={
                                courseArchiveModalShowSet
                              }
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
                )}
                {archivedCourseList.length !== 0 && (
                  <Accordion
                    collapsed
                    sectionName={"Archived Courses"}
                    content={
                      <div className="flex flex-wrap gap-x-[4%] gap-y-6 md:gap-y-8">
                        {archivedCourseList.map((courseObject, idx) => {
                          return (
                            <CourseCard
                              courseObject={courseObject}
                              targetCourseObjectSet={targetCourseObjectSet}
                              courseArchiveModalShowSet={
                                courseArchiveModalShowSet
                              }
                              key={idx}
                            />
                          );
                        })}
                      </div>
                    }
                  />
                )}
              </>
            ) : (
              <div className="animate-pulse w-full">
                <div className="bg-gray-200 h-6 rounded mb-4 w-32"></div>
                <div className="md:grid md:grid-cols-2 gap-x-[4%]">
                  <div className="bg-gray-200 h-24 md:h-36 rounded mb-8"></div>
                  <div className="bg-gray-200 h-24 md:h-36 rounded mb-8"></div>
                </div>
                <div className="bg-gray-200 h-6 rounded mb-4 w-32"></div>
                <div className="md:grid md:grid-cols-2 gap-x-[4%]">
                  <div className="bg-gray-200 h-24 md:h-36 rounded mb-8"></div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
