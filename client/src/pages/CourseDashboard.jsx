import React from "react";
import colors from "tailwindcss/colors";
import logo from "media/iquiz_logo.svg"
import { Link } from "react-router-dom";

export default function CourseDashboard() {

  return (
    <>
      <div className="h-screen w-screen bg-gray-100">
        <header className="fixed h-28 w-full bg-white shadow-sm flex items-center px-24 justify-between z-50">
          <Link to="/"><img src={logo} className="h-7"></img></Link>
          <div className="flex gap-6">
            <div className="w-11 h-11 flex items-center justify-center rounded-full text-slate-500 hover:bg-gray-150 hover:text-slate-600 transition-all cursor-pointer">
              <BellIcon className="w-5" />
            </div>
            <div className="w-11 h-11 flex items-center justify-center rounded-full text-slate-500 hover:bg-gray-150 hover:text-slate-600 transition-all cursor-pointer">
              <CogIcon className="w-7" />
            </div>
          </div>
        </header>
        <main className="h-full pt-20 w-full">
          <div className="flex h-full w-fit gap-x-16 flex-col sm:flex-wrap gap-11 px-24 py-20">
            <CourseCard courseCode="CSCC09" courseName="Programming on the Web" courseSession="Fall 23" notificationNum={1} />
            <CourseCard courseCode="MATB24" courseName="Linear Algebra II" courseSession="Fall 23" accentColor={colors.rose[500]} />
            <CourseCard courseCode="STAC50" courseName="Data Collection" courseSession="Fall 23" accentColor={colors.orange[500]} />
            {/* <CourseCard courseCode="LINA01" courseName="Introduction to Linguistics" courseSession="Summer 23" accentColor={colors.teal[600]} /> */}
            <CourseCard courseCode="CSCD58" courseName="Computer Networks" courseSession="Summer 23" accentColor={colors.emerald[600]} />
            <CourseCard courseCode="CSCC01" courseName="Introduction to Software Engineering" courseSession="Winter 22" accentColor={colors.indigo[600]} notificationNum={1} />
          </div>
        </main>
      </div>
    </>
  )
}

function CourseCard({ courseCode, courseName, courseSession, accentColor = colors.blue[600], notificationNum = 0 }) {
  return (
    <>
      <div className="rounded-md border-l-[24px] shadow-lg shadow-gray-200 cursor-pointer group" style={{ borderLeftColor: accentColor }}>
        <div className="border border-l-0 h-36 box-border w-96 shrink-0 items-end bg-white rounded-r-md flex pl-6 group-hover:bg-gray-100 transition">
          <div className="flex flex-col mb-6 w-full">
            <div className="flex items-center">
              <span className="text-gray-900 font-bold text-4xl">
                {courseCode}
              </span>
              <div className="flex relative items-center ml-4 h-fit w-fit px-1.5 font-medium py-0.5 rounded text-xs text-blue-600" style={{ color: accentColor }}>
                {courseSession}
                <div className="absolute w-full h-5 rounded opacity-10 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2" style={{ backgroundColor: accentColor }}></div>
              </div>
            </div>
            <span className="text-gray-500 text-xs ml-1 mt-0.5">{courseName}</span>
          </div>
          {notificationNum !== 0 &&
            <div className="self-start m-8 shrink-0 rounded-full h-5 w-5 text-center flex items-center justify-center text-white font-bold text-xs bg-red-500">
              {notificationNum}
            </div>
          }
        </div>
      </div >
    </>
  )
}

function BellIcon({ className }) {
  return (
    <div className={className}>
      <svg fill="currentColor" viewBox="0 0 21 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M10.4997 0C8.11273 0 5.82355 0.948211 4.13572 2.63604C2.44789 4.32387 1.49968 6.61305 1.49968 9V14.379L0.43918 15.4395C0.229466 15.6493 0.0866566 15.9165 0.0288052 16.2075C-0.0290461 16.4984 0.000658426 16.7999 0.114163 17.074C0.227669 17.348 0.419878 17.5823 0.666493 17.7471C0.913107 17.9119 1.20305 17.9999 1.49968 18H19.4997C19.7963 17.9999 20.0863 17.9119 20.3329 17.7471C20.5795 17.5823 20.7717 17.348 20.8852 17.074C20.9987 16.7999 21.0284 16.4984 20.9706 16.2075C20.9127 15.9165 20.7699 15.6493 20.5602 15.4395L19.4997 14.379V9C19.4997 6.61305 18.5515 4.32387 16.8636 2.63604C15.1758 0.948211 12.8866 0 10.4997 0ZM10.4997 24C9.30621 24 8.16161 23.5259 7.3177 22.682C6.47379 21.8381 5.99968 20.6935 5.99968 19.5H14.9997C14.9997 20.6935 14.5256 21.8381 13.6817 22.682C12.8377 23.5259 11.6932 24 10.4997 24Z"></path>
      </svg>
    </div>
  )
}

function CogIcon({ className }) {
  return (
    <div className={className}>
      <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path clip-rule="evenodd" fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"></path>
      </svg>
    </div>
  )
}