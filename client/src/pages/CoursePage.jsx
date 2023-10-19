import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"
import QuizCard from "components/page_components/QuizCard";
import Badge from "components/elements/Badge";
import CourseArrMock from "mock_data/CourseDashboard/CourseArrMock.json";
import QuizArrMockAll from "mock_data/CoursePage/QuizArrMock_all.json";
import QuizArrMockNew from "mock_data/CoursePage/QuizArrMock_new.json";
import QuizArrMockPast from "mock_data/CoursePage/QuizArrMock_past.json";
import NavBar from "components/page_components/NavBar";
import { useParams } from "react-router-dom";

function getCourseInfo(courseId) {
  return CourseArrMock.courseList[0]
}

function getQuizData(filter) {
  switch (filter) {
    case "New Quizzes":
      return QuizArrMockNew.response;
    case "All Quizzes":
      return QuizArrMockAll.response;
    case "Past Quizzes":
      return QuizArrMockPast.response;
    default:
      return;
  }

}

export default function CoursePage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selection, setSelection] = useState("New Quizzes");
  const [quizList, setQuizList] = useState(getQuizData(selection));

  const { courseId } = useParams();
  const courseInfo = getCourseInfo(courseId);
  const courseCode = courseInfo.courseCode;
  const courseSession = courseInfo.courseSession;
  const courseName = courseInfo.courseName;
  const accentColor = courseInfo.accentColor;

  function onSelectionChange(selection) {
    setShowDropdown(selection);
    setSelection(selection);
    setQuizList(getQuizData(selection));
    setShowDropdown(false);
  }

  const variants = {
    show: {
      opacity: 1,
      scale: 1,
      height: "auto",
      transition: {
        ease: "easeInOut",
        duration: 0.3,
      }
    },
    hide: {
      opacity: 0,
      scale: 0.95,
      height: 0,
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-36">
        <div className="h-fit flex flex-col md:px-24 px-8 w-full lg:w-[64rem]">
          <div className="flex items-end justify-between mb-6 lg:mb-8">
            <div className="flex flex-col pr-4">
              <Badge label={courseSession} accentColor={accentColor} />
              <div className="flex items-center">
                <span className="text-gray-900 font-bold text-3xl lg:text-4xl">
                  {courseCode}
                </span>
              </div>
              <span className="text-gray-500 text-xs ml-1 mt-0.5">{courseName}</span>
            </div>
            <div>
              <button
                onClick={(e) => {
                  setShowDropdown(!showDropdown);
                  e.target.focus();
                }}
                onBlur={() => setShowDropdown(false)}
                className="text-slate-600 border shadow-sm bg-white hover:bg-gray-200 rounded-lg text-sm w-36 h-10 flex items-center justify-between px-4 focus:ring focus:ring-blue-300"
              >
                {selection}
                <input type="checkbox" className="peer hidden" checked={showDropdown} readOnly />
                <svg className="h-3.5 transition ease-in-out duration-200 peer-checked:rotate-180" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" stroke="currentColor" strokeWidth="1"></path>
                </svg>
              </button>
              <input type="checkbox" className="peer hidden" checked={showDropdown} readOnly />
              <AnimatePresence>{showDropdown &&
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onBlur={() => setShowDropdown(false)}
                  className="z-10 absolute mt-2 hidden peer-checked:block bg-white rounded-lg shadow-lg w-36">
                  <div className="py-2 text-sm text-gray-700">
                    <button onMouseDown={() => { onSelectionChange("New Quizzes") }} className="px-4 py-2 w-full hover:bg-gray-150">New Quizzes</button>
                    <button onMouseDown={() => { onSelectionChange("All Quizzes") }} className="px-4 py-2 w-full hover:bg-gray-150">All Quizzes</button>
                    <button onMouseDown={() => { onSelectionChange("Past Quizzes") }} className="px-4 py-2 w-full hover:bg-gray-150">Past Quizzes</button>
                  </div>
                </motion.div>
              }
              </AnimatePresence>

            </div>
          </div>
          <AnimatePresence>{
            <motion.div key={quizList} variants={variants} animate={"show"} initial={"hide"} exit={"hide"}> {
              <QuizList quizDataArr={quizList} />
            }
            </motion.div>
          }
          </AnimatePresence>
        </div >
      </div >
    </>
  )
}

function QuizList({ quizDataArr }) {
  return (
    <div className={"flex flex-col w-full gap-4"}>
      {
        quizDataArr.map((quizObject, idx) => {
          return <QuizCard quizObject={quizObject} key={idx} />
        })
      }
    </div>
  )
}
