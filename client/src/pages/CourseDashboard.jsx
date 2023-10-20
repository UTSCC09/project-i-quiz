import React, { useRef, useState } from "react";
import NavBar from "components/page_components/NavBar";
import CourseCard from "components/page_components/CourseCard";
import CourseDataMock_active from "mock_data/CourseDashboard/CourseDataMock_active.json";
import CourseDataMock_archived from "mock_data/CourseDashboard/CourseDataMock_archived.json";
import QuizDataMock_available from "mock_data/CourseDashboard/QuizDataMock_available.json";
import QuizDataMock_upcoming from "mock_data/CourseDashboard/QuizDataMock_upcoming.json";
import QuizCard from "components/page_components/QuizCard";
import Accordion from "components/elements/Accordion";

function getActiveCourses() {
  return CourseDataMock_active.courseList;
}

function getArchivedCourses() {
  return CourseDataMock_archived.courseList;
}

function getAvailableQuizzes() {
  return QuizDataMock_available.quizList;
}

function getUpcomingQuizzes() {
  return QuizDataMock_upcoming.quizList;
}

export default function CourseDashboard() {
  const quizSectionRef = useRef(null);
  const courseSectionRef = useRef(null);

  const [selectedTab, _setSelectedTab] = useState("quizzes");
  function setSelectedTab(selection) {
    _setSelectedTab(selection);
    quizSectionRef.current.classList.toggle("hidden");
    courseSectionRef.current.classList.toggle("hidden");
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen w-full bg-gray-100">
        <main className="h-full px-8 gap-y-8 gap-x-[4%] md:px-24 w-full flex flex-col lg:flex-row py-32 sm:py-36">
          <div className="flex lg:hidden bg-gray-200 rounded-lg w-full justify-between">
            <label className="cursor-pointer w-[49%]">
              <input type="radio" name="tab" className="hidden peer" checked={selectedTab === "quizzes"}
                onChange={() => setSelectedTab("quizzes")} />
              <div
                className="rounded-lg p-2 text-sm peer-checked:font-medium text-center  peer-checked:bg-white text-slate-600 peer-checked:border peer-checked:shadow-sm w-full"
              >
                Quizzes
              </div>
            </label>
            <label className="cursor-pointer w-[49%]">
              <input type="radio" id="courses" name="tab" className="hidden peer" checked={selectedTab === "courses"} onChange={() => setSelectedTab("courses")} />
              <div
                className="rounded-lg p-2 text-sm peer-checked:font-medium text-center  peer-checked:bg-white text-slate-600 peer-checked:border peer-checked:shadow-sm w-full"
              >
                Courses
              </div>
            </label>
          </div>
          <div ref={quizSectionRef} className="lg:w-[35%] flex flex-col gap-8 lg:flex">
            <Accordion sectionName="Available Quizzes"
              content={
                <div className="flex flex-col gap-4 lg:gap-6">{
                  getAvailableQuizzes().map((quizObject, idx) => {
                    return <QuizCard quizObject={quizObject} key={idx} />
                  })}
                </div>
              }
            />
            <Accordion sectionName="Upcoming Quizzes"
              content={
                <div className="flex flex-col gap-4 lg:gap-6">{
                  getUpcomingQuizzes().map((quizObject, idx) => {
                    return <QuizCard quizObject={quizObject} key={idx} />
                  })}
                </div>
              }
            />
          </div>
          <div ref={courseSectionRef} className="hidden flex flex-col gap-8 lg:flex lg:w-[65%]">
            <Accordion sectionName={"My Courses"} content=
              {
                <div className="flex flex-wrap gap-x-[4%] 2xl:gap-x-[3.5%] gap-y-6 md:gap-y-8">{
                  getActiveCourses().map((courseObject, idx) => {
                    return <CourseCard courseObject={courseObject} key={idx} />
                  })}
                </div>
              }
            />
            <Accordion collapesed sectionName={"Archived Courses"} content=
              {
                <div className="flex flex-wrap gap-x-[4%] 2xl:gap-x-[3.5%] gap-y-6 md:gap-y-8">{
                  getArchivedCourses().map((courseObject, idx) => {
                    return <CourseCard courseObject={courseObject} key={idx} />
                  })}
                </div>
              }
            />
          </div>
        </main>
      </div >
    </>
  )
}
