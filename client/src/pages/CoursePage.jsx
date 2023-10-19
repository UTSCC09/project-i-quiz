import React, { useState } from "react";
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
    case "new":
      return QuizArrMockNew.response;
    case "all":
      return QuizArrMockAll.response;
    case "past":
      return QuizArrMockPast.response;
    default:
      return;
  }

}

export default function CoursePage() {
  const { courseId } = useParams();
  const courseInfo = getCourseInfo(courseId);
  const courseCode = courseInfo.courseCode;
  const courseSession = courseInfo.courseSession;
  const courseName = courseInfo.courseName;
  const accentColor = courseInfo.accentColor;

  const [quizList, setQuizList] = useState(getQuizData("new"));

  function onChange() {
    setQuizList(getQuizData(document.getElementById("filterSelect").value))
  }

  const variants = {
    show: {
      opacity: 1,
      scale: 1,
      height: "auto",
      transition: {
        ease: "easeInOut",
        duration: 0.3,
        opacity: { delay: 0.15 }
      }
    },
    hide: {
      opacity: 0,
      scale: 0.95,
      height: 0
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
            <div className="shadow-sm rounded-lg border">
              <select
                name="quizFilter"
                id="filterSelect"
                className="w-36 outline-1 pl-3 h-8 rounded-lg border-gray-300 text-gray-700 text-sm border-r-[12px] border-r-transparent"
                style={{ outlineColor: courseInfo.accentColor }}
                defaultValue="new"
                onChange={onChange}
              >
                <option value="new">New Quizzes</option>
                <option value="past">Past Quizzes</option>
                <option value="all">All Quizzes</option>
              </select>
            </div>
          </div>
          <AnimatePresence>{
            <motion.div key={quizList} variants={variants} animate={"show"} initial={"hide"} exit={"hide"}> {
              <QuizList quizDataArr={quizList} />
            }
            </motion.div>
          }
          </AnimatePresence>
        </div>
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
