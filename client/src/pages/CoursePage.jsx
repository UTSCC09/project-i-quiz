import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import QuizCard from "components/page_components/QuizCard";
import Badge from "components/elements/Badge";
import QuizDataMock_all from "mock_data/CoursePage/QuizDataMock_all.json";
import QuizDataMock_new from "mock_data/CoursePage/QuizDataMock_new.json";
import QuizDataMock_past from "mock_data/CoursePage/QuizDataMock_past.json";
import NavBar from "components/page_components/NavBar";
import DropdownSelection from "components/elements/DropdownSelection";
import DropdownMenu from "components/elements/DropdownMenu";
import { isStudentUserType } from "utils/CookieUtils";
import Toast from "components/elements/Toast";
import CourseAccentColorModal from "components/page_components/CourseAccentColorModal";
import CourseArchiveModal from "components/page_components/CourseArchiveModal";
import CourseDropModal from "components/page_components/CourseDropModal";
import AccessCodeUpdateModal from "components/page_components/AccessCodeUpdateModal";
import { fetchCourseObject } from "api/CourseApi";

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
  const navigate = useNavigate();
  const filters = ["New Quizzes", "All Quizzes", "Past Quizzes"];
  const { courseId } = useParams();
  const [selection, setSelection] = useState("New Quizzes");
  const [quizList, setQuizList] = useState([]);
  const [courseObject, courseObjectSet] = useState({});
  const [courseSettingsDropdownShow, courseSettingsDropdownShowSet] =
    useState(false);
  const [accentColorModalShow, accentColorModalShowSet] = useState(false);
  const [courseArchiveModalShow, courseArchiveModalShowSet] = useState(false);
  const [courseDropModalShow, courseDropModalShowSet] = useState(false);
  const [accessCodeUpdateModalShow, accessCodeUpdateModalShowSet] =
    useState(false);
  const [toastMessage, toastMessageSet] = useState();

  const dropdownRef = useRef();
  const isStudent = isStudentUserType();

  function refetchDataAndShowToast(successMessage) {
    fetchCourseObject(courseId).then((result) => {
      if (result.success) {
        courseObjectSet(result.payload);
        toastMessageSet(successMessage);
        setTimeout(() => {
          toastMessageSet();
        }, 3000);
      } else {
        console.error(result.message);
      }
    });
  }

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

  let archived = courseObject.archived;
  let courseEditOptions = [];

  if (!archived){
    courseEditOptions.push({
      label: "Edit color",
      onClick: () => {
        accentColorModalShowSet(true);
      },
    });

    courseEditOptions.push({
      label: "Archive Course",
      onClick: () => {
        courseArchiveModalShowSet(true);
      },
    });

    if (isStudent) {
      courseEditOptions.push({
        label: <div className="text-red-600">Drop course</div>,
        onClick: () => {
          courseDropModalShowSet(true);
        },
      });
    } else {
      courseEditOptions.push({
        label: "Update access code",
        onClick: () => {
          accessCodeUpdateModalShowSet(true);
        },
      });
    }
  } else {
    courseEditOptions.push({
      label: "Unarchive Course",
      onClick: () => {
        courseArchiveModalShowSet(true);
      },
    });
  }

  useEffect(() => {
    fetchCourseObject(courseId).then((result) => {
      if (result.success) {
        courseObjectSet(result.payload);
        document.querySelector("main").classList.remove("hidden");
      } else {
        console.error(result.message);
      }
    });

    /* TODO: Fetch actual quiz list */
    setQuizList(getQuizData(selection));
  }, [courseId, courseObjectSet]);

  return (
    <>
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <CourseAccentColorModal
        courseObject={courseObject}
        onSuccess={() => {
          const successMessage = `New accent color has been set for ${courseObject.courseCode} ${courseObject.courseSemester}`;
          refetchDataAndShowToast(successMessage);
        }}
        modalShow={accentColorModalShow}
        modalShowSet={accentColorModalShowSet}
      />
      <CourseArchiveModal
        modalShow={courseArchiveModalShow}
        modalShowSet={courseArchiveModalShowSet}
        courseObject={courseObject}
        onSuccess={() => {
          const successMessage = `${courseObject.courseCode} ${courseObject.courseSemester} has been archived from your course list`;
          navigate("/", { state: { passInMessage: successMessage } });
        }}
      />
      <CourseDropModal
        modalShow={courseDropModalShow}
        modalShowSet={courseDropModalShowSet}
        courseObject={courseObject}
        onSuccess={() => {
          const successMessage = `${courseObject.courseCode} ${courseObject.courseSemester} has been removed from your course list`;
          navigate("/", { state: { passInMessage: successMessage } });
        }}
      />
      <AccessCodeUpdateModal
        modalShow={accessCodeUpdateModalShow}
        modalShowSet={accessCodeUpdateModalShowSet}
        courseObject={courseObject}
        onSuccess={(newAccessCode) => {
          const successMessage = `Access code for ${courseObject.courseCode} ${courseObject.courseSemester} has been updated to ${newAccessCode}`;
          refetchDataAndShowToast(successMessage);
        }}
      />
      <NavBar />
      <div
        className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-36"
        onClick={() => {
          if (dropdownRef.current.dropdownShow) {
            dropdownRef.current.dropdownShowSet(false);
          }
        }}
      >
        <main className="h-fit flex flex-col md:px-24 px-8 w-full lg:w-[64rem] hidden">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div className="flex flex-col pr-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-900 font-bold text-3xl md:text-4xl mb-1">
                  {courseObject.courseCode}
                </span>
                <Badge
                  label={courseObject.courseSemester}
                  accentColor={courseObject.accentColor}
                />
              </div>
              <span className="text-gray-500 text-sm ml-0.5">
                {courseObject.courseName}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <div
                  className="bg-white shadow-sm h-10 w-10 text-center rounded-md text-slate-500 border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all"
                  onClick={() => {
                    courseSettingsDropdownShowSet(true);
                  }}
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
                <DropdownMenu
                  options={courseEditOptions}
                  dropdownShow={courseSettingsDropdownShow}
                  dropdownShowSet={courseSettingsDropdownShowSet}
                />
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
            <motion.div
              key={quizList}
              variants={variants}
              animate={"show"}
              initial={"hide"}
              exit={"hide"}
            >
              <QuizList quizDataArr={quizList} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
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
