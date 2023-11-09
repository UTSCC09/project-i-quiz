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

async function updateAccentColor(courseId, accentColor) {
  return fetch("/api/courses/accent_color", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({
      courseId,
      accentColor,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    });
}

async function dropCourse(courseId) {
  return fetch("/api/courses/drop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({ courseId }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    });
}

async function fetchData() {
  if (isStudentUserType()) {
    return fetchEnrolledCourses();
  } else {
    return fetchInstructedCourses();
  }
}

// Fetch enrolled courses
async function fetchEnrolledCourses() {
  return fetch("/api/courses/enrolled", {
    method: "GET",
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      if (!result.success) {
        console.error(result.message);
        return [];
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
}

// Fetch instructed courses
async function fetchInstructedCourses() {
  return fetch("/api/courses/instructed", {
    method: "GET",
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      if (!result.success) {
        console.error(result.message);
        return [];
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
}

/* -- React Component -- */

export default function DashboardPage() {
  const quizSectionRef = useRef(null);
  const courseSectionRef = useRef(null);
  const isStudent = isStudentUserType();

  const [activeCourseList, activeCourseListSet] = useState([]);
  const [selectedTab, _setSelectedTab] = useState();
  const [enrollModalShow, enrollModalShowSet] = useState(false);
  const [accentColorModalShow, accentColorModalShowSet] = useState(false);
  const [courseDropModalShow, courseDropModalShowSet] = useState(false);
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

  useEffect(() => {
    fetchData().then((fetchedPayload) => {
      activeCourseListSet(fetchedPayload);
    });
    setSelectedTab(
      localStorage.getItem("selected_tab").toString() ?? "quizzes"
    );
  }, [activeCourseListSet]);

  return (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <CourseEnrollModal
        enrollModalShow={enrollModalShow}
        enrollModalShowSet={enrollModalShowSet}
        onSuccess={(courseCode) => {
          enrollModalShowSet(false);
          fetchData().then((payload) => {
            activeCourseListSet(payload);
            setTimeout(() => {
              toastMessageSet(
                courseCode + " has been added to your course list"
              );
            }, 200);
          });
        }}
      />
      {targetCourseObject && (
        <CourseAccentColorModal
          courseObject={targetCourseObject}
          updateAccentColor={updateAccentColor}
          onSuccess={() => {
            fetchData()
              .then((payload) => {
                activeCourseListSet(payload);
              })
              .then(() => {
                accentColorModalShowSet(false);
                toastMessageSet(
                  `New accent color has been set for ${targetCourseObject.courseCode} ${targetCourseObject.courseSemester}`
                );
              });
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
            fetchData()
              .then((payload) => {
                activeCourseListSet(payload);
              })
              .then(() => {
                courseDropModalShowSet(false);
                toastMessageSet(
                  `${targetCourseObject.courseCode} ${targetCourseObject.courseSemester} has been removed from your course list`
                );
              });
          }}
        />
      )}
      <NavBar
        additionalButtons={
          <button
            className="btn-outline py-0 text-sm w-28 h-8 sm:h-10 shrink-0"
            onClick={isStudent ? () => enrollModalShowSet(true) : () => {}}
          >
            {isStudent ? "Add course" : "Create course"}
          </button>
        }
      />
      <div className="min-h-screen w-full bg-gray-100">
        <main className="h-full px-8 gap-y-8 gap-x-[4%] md:px-24 w-full flex flex-col lg:flex-row py-32 sm:py-36">
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
                        key={idx}
                      />
                    );
                  })}
                </div>
              }
            />
            <Accordion
              collapesed
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
