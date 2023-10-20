import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NavBar from "components/page_components/NavBar";
import CourseCard from "components/page_components/CourseCard";
import CourseArrMock from "mock_data/CourseDashboard/CourseArrMock.json";
import QuizArrMock_available from "mock_data/CourseDashboard/QuizArrMock_available.json";
import QuizArrMock_upcoming from "mock_data/CourseDashboard/QuizArrMock_upcoming.json";
import QuizCard from "components/page_components/QuizCard";

const courseData = CourseArrMock;
const quizData = QuizArrMock_available;
const quizData2 = QuizArrMock_upcoming;

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
        <main className="h-fit px-8 gap-y-8 gap-x-[4%] md:px-24 w-full flex flex-col lg:flex-row py-32 sm:py-36">
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
            <QuizListSection sectionName="Available Quizzes" quizDataArr={quizData.quizList} />
            <QuizListSection sectionName="Upcoming Quizzes" quizDataArr={quizData2.quizList} />
          </div>
          <div ref={courseSectionRef} className="hidden lg:block lg:w-[65%]">
            <div className="text-slate-600 font-medium mb-4">My Courses</div>
            <div className="flex flex-wrap gap-x-[4%] 2xl:gap-x-[3.5%] gap-y-6 md:gap-y-8 h-fit lg:w1-fit">
              {
                courseData.courseList.map((courseObject, idx) => {
                  return <CourseCard courseObject={courseObject} key={idx} />
                })
              }
            </div>
          </div>
        </main>
      </div >
    </>
  )
}
const variants = {
  show: {
    opacity: 1,
    scale: 1,
    height: "auto",
    transition: {
      ease: "easeOut",
      duration: 0.4,
      opacity: { delay: 0.15 },
    }
  },
  hide: {
    opacity: 0,
    scale: 0.95,
    height: 0,
  }
};

function QuizListSection({ sectionName, quizDataArr }) {
  const [show, setShow] = useState(true);
  return (
    <>
      <div className="flex flex-col cursor-pointer" onClick={() => setShow(!show)}>
        <div className="flex items-center gap-2.5 text-slate-600 peer-checked:opacity-50">
          <input name="showToggle" type="checkbox" className="peer hidden" checked={!show} readOnly />
          <div className="font-medium">{sectionName}</div>
          <svg className="h-3.5 transition ease-in-out duration-200 peer-checked:rotate-180" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path clipRule="evenodd" fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" stroke="currentColor" strokeWidth="1"></path>
          </svg>
        </div>
        <AnimatePresence initial={false}> {show &&
          <motion.div
            variants={variants}
            initial={"hide"}
            animate={"show"}
            exit={"hide"}>
            <div className="mt-4 flex flex-col gap-4 lg:gap-6">
              {
                quizDataArr.map((quizObject, idx) => {
                  return <QuizCard quizObject={quizObject} key={idx} />
                })
              }
            </div>
          </motion.div>}
        </AnimatePresence>
      </div>
    </>
  )
}
