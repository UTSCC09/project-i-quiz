import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import QuizCard from "components/page_components/QuizCard";
import Badge from "components/elements/Badge";
import QuizDataMock_all from "mock_data/CoursePage/QuizDataMock_all.json";
import QuizDataMock_new from "mock_data/CoursePage/QuizDataMock_new.json";
import QuizDataMock_past from "mock_data/CoursePage/QuizDataMock_past.json";
import NavBar from "components/page_components/NavBar";
import DropdownSelection from "components/elements/DropdownSelection";

async function fetchCourseInfo(courseId) {
  return fetch("/api/courses/" + courseId, {
    method: "GET",
    withCredentials: true,
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(err);
    });
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
  const filters = ["New Quizzes", "All Quizzes", "Past Quizzes"];
  const { courseId } = useParams();
  const [selection, setSelection] = useState("New Quizzes");
  const [quizList, setQuizList] = useState(getQuizData(selection));
  const dropdownRef = useRef();
  const [courseInfo, courseInfoSet] = useState({});
  useEffect(() => {
    fetchCourseInfo(courseId).then((result) => {
      if (result.success) {
        courseInfoSet(result.payload);
      } else {
        console.error(result.message);
      }
    });
  }, [courseInfoSet, courseId]);

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
      },
    },
    hide: {
      opacity: 0,
      scale: 0.95,
      height: 0,
    },
  };

  return (
    <>
      <NavBar />
      {courseInfo && (
        <div
          className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-36"
          onClick={() => {
            if (dropdownRef.current.dropdownShow) {
              dropdownRef.current.dropdownShowSet(false);
            }
          }}
        >
          <div className="h-fit flex flex-col md:px-24 px-8 w-full lg:w-[64rem]">
            <div className="flex items-end justify-between mb-6 md:mb-8">
              <div className="flex flex-col pr-4">
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-bold text-3xl md:text-4xl mb-1">
                    {courseInfo.courseCode}
                  </span>
                  <Badge
                    label={courseInfo.courseSemester}
                    accentColor={courseInfo.accentColor}
                  />
                </div>
                <span className="text-gray-500 text-sm ml-0.5">
                  {courseInfo.courseName}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div
                  className="bg-white shadow-sm h-10 w-10 text-center rounded-md text-slate-500 border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all"
                  onClick={() => {}}
                >
                  {/* [Credit]: svg from https://heroicons.dev */}
                  <svg
                    className="h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                  </svg>
                </div>
                <div className="shadow-sm">
                  <DropdownSelection
                    ref={dropdownRef}
                    selections={filters}
                    selection={selection}
                    onSelectionChange={onSelectionChange}
                    height="2.5rem"
                  />
                </div>
              </div>
            </div>
            <AnimatePresence>
              {
                <motion.div
                  key={quizList}
                  variants={variants}
                  animate={"show"}
                  initial={"hide"}
                  exit={"hide"}
                >
                  {" "}
                  {<QuizList quizDataArr={quizList} />}
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}

function QuizList({ quizDataArr }) {
  return (
    <div className={"flex flex-col w-full gap-4"}>
      {quizDataArr.map((quizObject, idx) => {
        return <QuizCard quizObject={quizObject} key={idx} />;
      })}
    </div>
  );
}
