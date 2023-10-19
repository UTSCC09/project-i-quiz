import React from "react";
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
  return (
    <>
      <NavBar />
      <div className="min-h-screen w-screen bg-gray-100">
        <main className="h-fit px-8 gap-y-8 gap-x-[4%] md:px-24 w-full flex flex-col lg:flex-row py-36">
          <div className="lg:w-[35%]">
            <QuizListSection />
          </div>
          <div className="lg:w-[65%]">
            <div className="text-slate-600 font-medium mb-6">My Courses</div>
            <div className="flex flex-wrap gap-x-[4%] 2xl:gap-x-[3.5%] gap-y-6 md:gap-y-8 h-fit lg:w1-fit">
              {
                courseData.courseList.map((courseObject, idx) => {
                  return <CourseCard courseObject={courseObject} key={idx} />
                })
              }
            </div>
          </div>
        </main >
      </div >
    </>
  )
}

function QuizListSection() {
  return (
    <>
      {/* Available quizzes */}
      <div className="flex flex-col">
        <div className="text-slate-600 font-medium">Available quizzes</div>

        <div className="mt-4 flex flex-col gap-4 lg:gap-6">
          {
            quizData.quizList.map((quizObject, idx) => {
              return <QuizCard quizObject={quizObject} key={idx} />
            })
          }
        </div>
      </div>
      {/* Upcoming quizzes */}
      <div className="mt-8 flex flex-col">
        <div className="text-slate-600 font-medium">Upcoming quizzes</div>
        <div className="mt-4 flex flex-col gap-4 lg:gap-6">
          {
            quizData2.quizList.map((quizObject, idx) => {
              return <QuizCard quizObject={quizObject} key={idx} />
            })
          }
        </div>
      </div >
    </>
  )
}
