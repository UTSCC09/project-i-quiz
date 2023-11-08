import React, { useRef, useState } from "react";
import Badge from "components/elements/Badge";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function CourseCard({
  courseObject,
  notificationNum = 0,
  targetCourseObjectSet,
  accentColorModalShowSet,
  courseDropModalShowSet,
}) {
  const [showDropDown, showDropDownSet] = useState(false);
  const courseCardRef = useRef();

  const courseId = courseObject.courseId;
  const courseCode = courseObject.courseCode;
  const courseName = courseObject.courseName;
  const courseSemester = courseObject.courseSemester;
  const accentColor = courseObject.accentColor;

  return (
    <div ref={courseCardRef} className="w-full md:w-[48%] lg:w-[48%]">
      <div
        className="relative rounded-md w-full border-l-[16px] md:border-l-[24px] shadow shadow-gray-200 cursor-pointer h-fit flex items-center justify-end"
        style={{ borderLeftColor: accentColor }}
      >
        <Link
          to={"/courses/" + courseId}
          className="relative border border-l-0 py-4 md:py-0 h-fit md:h-36 box-border items-center md:items-end bg-white rounded-r-md flex px-4 md:px-6 hover:bg-gray-100 transition-all w-full"
        >
          <div className="flex flex-col md:mb-6 w-full pr-4">
            <Badge label={courseSemester} accentColor={accentColor} />
            <div className="flex items-center">
              <span className="text-gray-900 font-bold text-2xl md:text-3xl">
                {courseCode}
              </span>
            </div>
            <span className="text-gray-500 text-xs ml-1 mt-0.5">
              {courseName}
            </span>
          </div>
          {notificationNum !== 0 && (
            <div className="absolute md:top-5 right-10 shrink-0 rounded-full h-5 w-5 text-center flex items-center justify-center text-white font-bold text-xs bg-red-500">
              {notificationNum}
            </div>
          )}
        </Link>
        <button
          className="text-slate-600 absolute md:top-4 right-0 mx-2 p-1 rounded-full hover:bg-gray-100 transition"
          onClick={() => {
            showDropDownSet(!showDropDown);
          }}
        >
          {/* [Credit]: svg from https://heroicons.dev */}
          <svg
            className="h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
            />
          </svg>
        </button>
        <AnimatePresence>
          {showDropDown && (
            <motion.div
              initial={{ opacity: 0, y: "-5%" }}
              animate={{ opacity: 1, y: "0" }}
              exit={{ opacity: 0, y: "-5%" }}
              className="flex z-30 flex-col bg-white rounded-md shadow-lg shadow-gray-200 absolute mt-28 md:mt-8 mr-2 text-slate-600 text-sm border divide-y select-none"
            >
              <span
                className="py-2 px-4 hover:bg-gray-100 transition"
                onClick={() => {
                  targetCourseObjectSet(courseObject);
                  accentColorModalShowSet(true);
                  showDropDownSet(false);
                }}
              >
                Edit color
              </span>
              <span
                className="py-2 px-4 hover:bg-gray-100 transition text-red-600"
                onClick={() => {
                  targetCourseObjectSet(courseObject);
                  courseDropModalShowSet(true);
                  showDropDownSet(false);
                }}
              >
                Drop course
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {showDropDown && (
          <div
            className="fixed z-20 left-0 top-0 w-screen h-screen b1g-black bg-opacity-10 cursor-default"
            onClick={() => showDropDownSet(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
