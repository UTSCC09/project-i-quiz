import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"
import QuizCard from "components/page_components/QuizCard";
import Badge from "components/elements/Badge";
import CourseArrMock from "mock_data/DashboardPage/CourseDataMock_active.json";
import QuizDataMock_all from "mock_data/CoursePage/QuizDataMock_all.json";
import QuizDataMock_new from "mock_data/CoursePage/QuizDataMock_new.json";
import QuizDataMock_past from "mock_data/CoursePage/QuizDataMock_past.json";
import NavBar from "components/page_components/NavBar";
import Dropdown from "components/elements/Dropdown";

function getCourseInfo(courseId) {
  return CourseArrMock.courseList[0]
}

function getQuizData(filter) {
  switch (filter) {
    case "New Quizzes":
      return QuizDataMock_new.response;
    case "All Quizzes":
      return QuizDataMock_all.response;
    case "Past Quizzes":
      return QuizDataMock_past.response;
    default:
      return;
  }

}

export default function CoursePage() {
  const [selection, setSelection] = useState("New Quizzes");
  const [quizList, setQuizList] = useState(getQuizData(selection));
  const dropdownRef = useRef(null)

  const { courseId } = useParams();
  const courseInfo = getCourseInfo(courseId);
  const courseCode = courseInfo.courseCode;
  const courseSession = courseInfo.courseSession;
  const courseName = courseInfo.courseName;
  const accentColor = courseInfo.accentColor;

  function onSelectionChange(selection) {
    setSelection(selection);
    setQuizList(getQuizData(selection));
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
      <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-36"
        onClick={() => {
          if (dropdownRef.current.showDropdown) {
            dropdownRef.current.setShowDropdown(false);
          }
        }}>
        <div className="h-fit flex flex-col md:px-24 px-8 w-full lg:w-[64rem]">
          <div className="flex items-end justify-between mb-6 lg:mb-8">
            <div className="flex flex-col pr-4">
              <Badge label={courseSession} accentColor={accentColor} />
              <div className="flex items-center">
                <span className="text-gray-900 font-bold text-3xl md:text-4xl">
                  {courseCode}
                </span>
              </div>
              <span className="text-gray-500 text-xs md:text-sm ml-1 mt-0.5">{courseName}</span>
            </div>
            <Dropdown ref={dropdownRef} selection={selection} onSelectionChange={onSelectionChange} />
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
