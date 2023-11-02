import React, { useEffect, useRef, useState } from "react";
import NavBar from "components/page_components/NavBar";
import CourseCard from "components/page_components/CourseCard";
import CourseDataMock_archived from "mock_data/DashboardPage/CourseDataMock_archived.json";
import QuizDataMock_available from "mock_data/DashboardPage/QuizDataMock_available.json";
import QuizDataMock_upcoming from "mock_data/DashboardPage/QuizDataMock_upcoming.json";
import QuizCard from "components/page_components/QuizCard";
import Accordion from "components/elements/Accordion";
import Modal from "components/elements/Modal";
import SingleLineInput from "components/elements/SingleLineInput";
import colors from "tailwindcss/colors";
import { motion } from "framer-motion";


function getArchivedCourses() {
  return CourseDataMock_archived.courseList;
}

function getAvailableQuizzes() {
  return QuizDataMock_available.quizList;
}

function getUpcomingQuizzes() {
  return QuizDataMock_upcoming.quizList;
}

export default function DashboardPage() {
  const quizSectionRef = useRef(null);
  const courseSectionRef = useRef(null);

  const [activeCourseList, activeCourseListSet] = useState([]);
  const [selectedTab, _setSelectedTab] = useState("quizzes");
  const [enrollModalShow, enrollModalShowSet] = useState(false);

  function setSelectedTab(selection) {
    _setSelectedTab(selection);
    quizSectionRef.current.classList.toggle("hidden");
    courseSectionRef.current.classList.toggle("hidden");
  }

  useEffect(() => {
    // Fetch enrolled courses
    fetch("/api/courses/enrolled", {
      method: "GET",
      withCredentials: true,
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (!result.success) {
          console.error(result.message);
          return;
        }
        activeCourseListSet(result.payload);
      })
      .catch((err) => {
        console.error(err);
      })
  }, [activeCourseListSet])

  return (
    <>
      <Modal modalShow={enrollModalShow} modalShowSet={enrollModalShowSet} content={<CourseEnrollmentModal />} />
      <NavBar additionalButtons={
        <button className="btn-primary py-0 text-sm w-28 h-10 shrink-0" onClick={() => enrollModalShowSet(true)}>Add course</button>
      } />
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
            <Accordion sectionName={"Active Courses"} content=
              {
                <div className="flex flex-wrap gap-x-[4%] gap-y-6 md:gap-y-8">{
                  activeCourseList.map((courseObject, idx) => {
                    return <CourseCard courseObject={courseObject} key={idx} />
                  })}
                </div>
              }
            />
            <Accordion collapesed sectionName={"Archived Courses"} content=
              {
                <div className="flex flex-wrap gap-x-[4%] gap-y-6 md:gap-y-8">{
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
const checkIconVariants = {
  unchecked: { pathLength: 0, opacity: 0, transition: { duration: 0.1 } },
  checked: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } }
};
const colorList = [colors.pink[500], colors.rose[500], colors.red[500], colors.orange[500], colors.amber[500], colors.yellow[500], colors.lime[500], colors.green[500], colors.emerald[500], colors.teal[500], colors.cyan[500], colors.blue[500], colors.blue[600], colors.indigo[500], colors.violet[500], colors.purple[500],]

function CourseEnrollmentModal() {
  const courseAccessCodeInputRef = useRef(null);
  const [step, stepSet] = useState(0);
  const [colorPicked, colorPickedSet] = useState(colors.blue[500]);
  const [sessionPicked, sessionPickedSet] = useState();
  return (
    <>
      <div className="px-24 py-16">
        {step === 0 &&
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Add a new course</h1>
            <span className="w-96 text-gray-600">Please enter the access code provided by your course instructor.</span>
            <SingleLineInput ref={courseAccessCodeInputRef} label="Course Access Code" />
            <button className="btn-primary" onClick={() => {
              if (!courseAccessCodeInputRef.current.validate("required")) {
                return;
              }
              /* fetch("/api/courses/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
                body: JSON.stringify({ courseId: document.getElementById("input").value, sessionNumber: 1 })
              })
                .then((response) => response.json())
                .then((result) => {
                  // console.log(result);
                  stepSet(step + 1);
                }) */
              stepSet(step + 1);
            }}>Next</button>
          </div>}
        {step === 1 &&
          <div className="flex flex-col gap-6 w-96">
            <h1 className="text-2xl font-bold">Choose your session</h1>
            <div className="text-gray-600 flex flex-col gap-2">
              <span>Choose the session that you are enrolled in.</span>
              <span>If you are unsure about this, <u><b>confirm with your course instructor</b></u> before you proceed.</span>
            </div>
            <div className="flex flex-wrap gap-6 w-full my-4">
              {["LEC01", "LEC02"].map((session, idx) => {
                return <div onClick={() => sessionPickedSet(session)} key={idx}>
                  <input type="radio" value={session} checked={sessionPicked === session} name="sessionPicker" className="hidden peer" readOnly />
                  {/* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */}
                  <span className="cursor-pointer hover:opacity-80 px-4 py-2 transition-all rounded border font-bold text-gray-600  peer-checked:border-blue-600 peer-checked:text-blue-600">{session}</span>
                </div>
              })}
            </div >
            <button className="btn-primary" onClick={() => {
              stepSet(step + 1);
            }}>Enroll</button>
          </div>}
        {step === 2 &&
          <div className="flex flex-col gap-6 w-96">
            <h1 className="text-2xl font-bold">Add a new course</h1>
            <span className="text-gray-600">Choose a color for your newly added course</span>
            <div className="flex flex-wrap gap-[13.7px] w-full my-4">
              {colorList.map((color, idx) => {
                return <div onClick={() => colorPickedSet(color)} key={idx}>
                  <div className="h-9 w-9 rounded-full cursor-pointer hover:border-4 border-black border-opacity-10 transition-all flex justify-center items-center" style={{ backgroundColor: color }}>
                    {/* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */}
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="4"
                      stroke="currentColor"
                      className="h-4 opacity-30"
                      animate={colorPicked == color ? "checked" : "unchecked"}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                        variants={checkIconVariants}
                      />
                    </motion.svg>
                  </div>
                </div>
              })}
            </div >
            <button className="btn-primary" onClick={() => {
              fetch("/api/courses/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
                body: JSON.stringify({ courseId: document.getElementById("input").value, sessionNumber: 1 })
              })
                .then((response) => response.json())
                .then((result) => {
                  console.log(result);
                  stepSet(step + 1);
                })
            }}>Enroll</button>
          </div>}
      </div >
    </>
  )
}
