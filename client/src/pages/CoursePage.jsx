import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import QuizCard from "components/page_components/QuizCard";
import Badge from "components/elements/Badge";
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
import {
  getQuizzesForInstructedCourse,
  getQuizzesForEnrolledCourse,
} from "api/QuizApi";
import { AdjustmentsIcon, PlusIcon } from "components/elements/SVGIcons";
import colors from "tailwindcss/colors";
import Accordion from "components/elements/Accordion";

export default function CoursePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { passInCourseObject } = location.state ?? {};

  const filters = ["New Quizzes", "All Quizzes", "Past Quizzes"];
  const { courseId } = useParams();
  const [selection, setSelection] = useState("New Quizzes");
  const [quizList, setQuizList] = useState();
  const [filteredQuizList, filteredQuizListSet] = useState([]);
  const [draftQuizList, draftQuizListSet] = useState([]);
  const [courseObject, setCourseObject] = useState(passInCourseObject ?? {});
  const [accentColorModalShow, setAccentColorModalShow] = useState(false);
  const [courseArchiveModalShow, setCourseArchiveModalShow] = useState(false);
  const [courseDropModalShow, setCourseDropModalShow] = useState(false);
  const [accessCodeUpdateModalShow, setAccessCodeUpdateModalShow] =
    useState(false);
  const [toastMessage, toastMessageSet] = useState();

  const isStudent = isStudentUserType();

  const getFilteredQuizzes = (filter) => {
    if (!quizList) {
      return [];
    }
    const currentDateTime = new Date();
    switch (filter) {
      case "New Quizzes":
        return quizList.filter((quiz) => {
          const endTime = new Date(quiz.endTime);
          return quiz.isReleased && currentDateTime <= endTime;
        });
      case "All Quizzes":
        return quizList.filter((quiz) => {
          return quiz.isReleased;
        });
      case "Past Quizzes":
        return quizList.filter((quiz) => {
          const endTime = new Date(quiz.endTime);
          return quiz.isReleased && currentDateTime > endTime;
        });
      default:
        return [];
    }
  };

  function refetchDataAndShowToast(successMessage) {
    fetchCourseObject(courseId).then((result) => {
      if (!result.success) {
        console.error(result.message);
        return;
      }

      if (isStudent) {
        getQuizzesForEnrolledCourse(courseId).then((resultPayload) => {
          setQuizList(resultPayload);
        });
      } else {
        getQuizzesForInstructedCourse(courseId).then((resultPayload) => {
          setQuizList(resultPayload);
          draftQuizListSet(resultPayload.filter((quiz) => !quiz.isReleased));
        });
      }

      setCourseObject(result.payload);
      toastMessageSet(successMessage);
      setTimeout(() => {
        toastMessageSet();
      }, 3000);
    });
  }

  function onSelectionChange(selection) {
    setSelection(selection);
    filteredQuizListSet(getFilteredQuizzes(selection));
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

  if (!archived) {
    courseEditOptions.push({
      label: "Edit color",
      onClick: () => {
        setAccentColorModalShow(true);
      },
    });

    courseEditOptions.push({
      label: "Archive course",
      onClick: () => {
        setCourseArchiveModalShow(true);
      },
    });

    if (isStudent) {
      courseEditOptions.push({
        label: <div className="text-red-600">Drop course</div>,
        onClick: () => {
          setCourseDropModalShow(true);
        },
      });
    } else {
      courseEditOptions.push({
        label: "Update access code",
        onClick: () => {
          setAccessCodeUpdateModalShow(true);
        },
      });
    }
  } else {
    courseEditOptions.push({
      label: "Unarchive course",
      onClick: () => {
        setCourseArchiveModalShow(true);
      },
    });
  }

  useEffect(() => {
    fetchCourseObject(courseId).then((result) => {
      if (!result.success) {
        console.error(result.message);
        navigate("/page-not-found");
        return;
      }
      setCourseObject(result.payload);

      if (isStudent) {
        getQuizzesForEnrolledCourse(courseId).then((resultPayload) => {
          setQuizList(resultPayload);
        });
      } else {
        getQuizzesForInstructedCourse(courseId).then((resultPayload) => {
          setQuizList(resultPayload);
          draftQuizListSet(resultPayload.filter((quiz) => !quiz.isReleased));
        });
      }
    });
  }, [courseId, setQuizList, setCourseObject, isStudent, navigate]);

  useEffect(() => {
    const { passInMessage } = location.state ?? "";
    if (passInMessage) {
      toastMessageSet(passInMessage);
      navigate("", {});
      setTimeout(() => {
        toastMessageSet();
      }, 3000);
    }
  }, [location.state, navigate, toastMessageSet]);

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
        modalShowSet={setAccentColorModalShow}
      />
      <CourseArchiveModal
        modalShow={courseArchiveModalShow}
        modalShowSet={setCourseArchiveModalShow}
        courseObject={courseObject}
        onSuccess={() => {
          const successMessage = `${courseObject.courseCode} ${courseObject.courseSemester} has been archived from your course list`;
          navigate("/", { state: { passInMessage: successMessage } });
        }}
      />
      <CourseDropModal
        modalShow={courseDropModalShow}
        modalShowSet={setCourseDropModalShow}
        courseObject={courseObject}
        onSuccess={() => {
          const successMessage = `${courseObject.courseCode} ${courseObject.courseSemester} has been removed from your course list`;
          navigate("/", { state: { passInMessage: successMessage } });
        }}
      />
      <AccessCodeUpdateModal
        modalShow={accessCodeUpdateModalShow}
        modalShowSet={setAccessCodeUpdateModalShow}
        courseObject={courseObject}
        onSuccess={(newAccessCode) => {
          const successMessage = `Access code for ${courseObject.courseCode} ${courseObject.courseSemester} has been updated to ${newAccessCode}`;
          refetchDataAndShowToast(successMessage);
        }}
      />
      <NavBar />
      <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-36">
        <main className="h-fit flex flex-col md:px-24 px-8 w-full lg:w-[64rem]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between mb-6 md:mb-8 h-28 sm:h-16">
            <div className="flex flex-col pr-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-900 font-bold text-3xl md:text-4xl mb-1">
                  {courseObject.courseCode}
                </span>
                {courseObject.courseSemester && (
                  <Badge
                    label={courseObject.courseSemester}
                    accentColor={courseObject.accentColor}
                  />
                )}
              </div>
              <span className="text-gray-500 text-sm ml-0.5">
                {courseObject.courseName}
              </span>
            </div>
            <div className="flex gap-2 sm:gap-4 text-gray-700">
              <div className="flex gap-2 sm:gap-4">
                <DropdownMenu
                  buttonElement={
                    <button className="bg-white shadow-sm h-8 sm:h-10 w-8 sm:w-10 text-center rounded-md border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all">
                      <AdjustmentsIcon className="h-[18px] sm:h-5" />
                    </button>
                  }
                  options={courseEditOptions}
                  menuAlignLeft
                />
                {!isStudent && (
                  <Link
                    to="/create-quiz"
                    title="Create quiz"
                    state={{ passInCourseObject: courseObject }}
                    className="bg-white shadow-sm h-8 sm:h-10 w-8 sm:w-10 text-2xl sm:text-3xl font-light text-center rounded-md border cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all select-none"
                  >
                    <PlusIcon className="h-[18px] sm:h-5" />
                  </Link>
                )}
              </div>
              {
                <DropdownSelection
                  selections={filters}
                  selection={selection}
                  onSelectionChange={onSelectionChange}
                  showShadow
                />
              }
            </div>
          </div>
          {quizList ? (
            <div className="flex flex-col gap-8">
              {draftQuizList.length !== 0 && (
                <Accordion
                  sectionName="Drafts"
                  content={
                    <PendingQuizList
                      accentColor={colors.gray[500]}
                      quizArr={draftQuizList}
                      courseCode={courseObject.courseCode}
                    />
                  }
                />
              )}
              <Accordion
                sectionName="Released Quizzes"
                content={
                  <div>
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={filteredQuizList}
                        variants={variants}
                        animate={"show"}
                        initial={"hide"}
                        exit={"hide"}
                      >
                        {filteredQuizList.length === 0 ? (
                          <div className=" bg-gray-200 px-6 sm:px-8 h-16 flex items-center rounded-md text-sm sm:text-base text-gray-600">
                            {selection === "All Quizzes"
                              ? `No released quizzes`
                              : `No ${selection.toLowerCase()} available`}
                          </div>
                        ) : (
                          <QuizList
                            accentColor={courseObject.accentColor}
                            quizArr={filteredQuizList}
                            courseCode={courseObject.courseCode}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="animate-pulse w-full">
              <div className="bg-gray-200 h-20 md:h-24 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-20 md:h-24 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-20 md:h-24 rounded-md mb-4"></div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function QuizList({ quizArr, accentColor, courseCode }) {
  return (
    <div className={"flex flex-col w-full gap-4"}>
      {quizArr
        .sort((a, b) => {
          return new Date(a.startTime) - new Date(b.startTime);
        })
        .map((currQuizObject, idx) => {
          return (
            <QuizCard
              accentColor={accentColor}
              quizObject={{
                ...currQuizObject,
                courseCode,
              }}
              key={idx}
            />
          );
        })}
    </div>
  );
}

function PendingQuizList({ quizArr, accentColor, courseCode }) {
  return (
    <div className={"flex flex-col w-full gap-4"}>
      {quizArr.map((currQuizObject, idx) => {
        return (
          <QuizCard
            accentColor={accentColor}
            quizObject={{
              ...currQuizObject,
              courseCode,
            }}
            key={idx}
          />
        );
      })}
    </div>
  );
}
