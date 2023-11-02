
import React, { useRef, useState } from "react";
import SingleLineInput from "components/elements/SingleLineInput";
import colors from "tailwindcss/colors";
import { motion } from "framer-motion";
import Modal from "components/elements/Modal";

const checkIconVariants = {
  unchecked: { pathLength: 0, opacity: 0, transition: { duration: 0.1 } },
  checked: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } }
};

const colorList = [colors.pink[500], colors.rose[500], colors.red[500], colors.orange[500], colors.amber[500], colors.yellow[500], colors.lime[500], colors.green[500], colors.emerald[500], colors.teal[500], colors.cyan[500], colors.blue[500], colors.blue[600], colors.indigo[500], colors.violet[500], colors.purple[500]]


async function enrollInCourse(courseId, accentColor, sessionNumber) {
  return fetch("/api/courses/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({
      courseId, accentColor, sessionNumber
    })
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        return result.payload;
      }
    })
}

export default function CourseEnrollModal({ enrollModalShow, enrollModalShowSet, onSuccess }) {
  const courseAccessCodeInputRef = useRef();
  const alertRef = useRef();
  const [step, stepSet] = useState(0);
  const [colorPicked, colorPickedSet] = useState(colors.blue[500]);
  const [sessionPicked, sessionPickedSet] = useState();
  const [enrollInfo, enrollInfoSet] = useState();

  return (
    <>
      <Modal modalShow={enrollModalShow} modalShowSet={enrollModalShowSet} content={
        <div className="px-24 py-16">
          {step === 0 &&
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold">Add a new course</h1>
              <span className="w-96 text-gray-600">Please enter the access code provided by your course instructor.</span>
              <form className="gap-6 flex flex-col" onSubmit={(e) => e.preventDefault()}>
                <div ref={alertRef} className="rounded border-l-4 text-red-700 border-red-500 bg-red-50 p-4 text-sm col-span-6 hidden"></div>
                <SingleLineInput ref={courseAccessCodeInputRef} label="Course Access Code" />
                <button className="btn-primary" onClick={(e) => {
                  e.target.focus()
                  if (!courseAccessCodeInputRef.current.validate("required")) {
                    return;
                  }
                  fetch("/api/courses/enrollInfo/" + courseAccessCodeInputRef.current.getValue(), {
                    method: "GET",
                    withCredentials: true
                  })
                    .then((response) => response.json())
                    .then((result) => {
                      if (result.success) {
                        enrollInfoSet(result);
                        stepSet(step + 1);
                      }
                      else {
                        alertRef.current.textContent = result.message;
                        alertRef.current.classList.remove("hidden")
                        courseAccessCodeInputRef.current.setValidationState(false);
                      }
                    })
                }}>Next</button>
              </form>
            </div>}
          {step === 1 &&
            <div className="flex flex-col gap-6 w-96">
              <h1 className="text-2xl font-bold">Choose your session</h1>
              <div className="text-gray-600 flex flex-col gap-2">
                <span>Choose the session that you are enrolled in.</span>
                <span>If you are unsure about this, <u><b>confirm with your course instructor</b></u> before you proceed.</span>
              </div>
              <div className="flex flex-wrap gap-6 w-full my-4">
                {enrollInfo.sessions.map((session, idx) => {
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
                enrollInCourse(enrollInfo.courseId, colorPicked, sessionPicked).then((payload) => {
                  onSuccess(payload.courseCode);
                })
              }}>Enroll</button>
            </div>}
        </div>
      } />
    </>
  )
}
