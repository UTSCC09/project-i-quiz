import React from "react";
import Badge from "components/elements/Badge";
import { Link } from "react-router-dom";

export default function CourseCard({ courseObject, notificationNum = 0 }) {
  const courseId = courseObject._id;
  const courseCode = courseObject.courseCode;
  const courseName = courseObject.courseName;
  const courseSession = courseObject.courseSession;
  const accentColor = courseObject.accentColor;

  return (
    <Link to={"/courses/" + courseId} className="w-full md:w-[48%] lg:w-[48%]">
      <div className="rounded-md border-l-[16px] md:border-l-[24px] shadow shadow-gray-200 cursor-pointer group h-fit" style={{ borderLeftColor: accentColor }}>
        <div className="relative border border-l-0 py-4 md:py-0 h-fit md:h-36 box-border items-center md:items-end bg-white rounded-r-md flex px-4 md:px-6 group-hover:bg-gray-100 transition-all">
          <div className="flex flex-col md:mb-6 w-full pr-4">
            <Badge label={courseSession} accentColor={accentColor} />
            <div className="flex items-center">
              <span className="text-gray-900 font-bold text-2xl md:text-3xl">
                {courseCode}
              </span>
            </div>
            <span className="text-gray-500 text-xs ml-1 mt-0.5">{courseName}</span>
          </div>
          {notificationNum !== 0 &&
            <div className="absolute md:top-8 right-8 shrink-0 rounded-full h-5 w-5 text-center flex items-center justify-center text-white font-bold text-xs bg-red-500">
              {notificationNum}
            </div>
          }
        </div>
      </div >
    </Link>
  )
}
