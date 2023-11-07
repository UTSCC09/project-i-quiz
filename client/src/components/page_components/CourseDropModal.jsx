import React, { useRef } from "react";
import Modal from "components/elements/Modal";
import SingleLineInput from "components/elements/SingleLineInput";

async function dropCourse(courseId) {
  return fetch("/api/courses/drop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({ courseId })
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
}

export default function CourseDropModal({ showDropCourseModal, showDropCourseModalSet, courseCode, courseSemester, courseId, onSuccess }) {
  const alertRef = useRef();
  const courseCodeInputRef = useRef();
  const semesterInputRef = useRef();
  return (
    <Modal modalShow={showDropCourseModal} modalShowSet={showDropCourseModalSet} content={
      <div className="flex flex-col w-96 gap-6">
        <h1 className="text-2xl font-bold">Dropping a course</h1>
        <div ref={alertRef} className="rounded border-l-4 text-red-700 border-red-600 bg-red-50 p-4 text-sm col-span-6 hidden"></div>
        <div className="flex flex-col gap-4 text-gray-600">
          <span>Are you sure you want to drop <b>{courseCode} {courseSemester}</b>? </span>
          <span>By dropping a course on iQuiz, you will <b>lose access</b> to any quizzes from the course, including your own <b>quiz history</b>. </span>
          <span>Please proceed only if you have officially withdrawn from the course at your school.</span>
          <span>To confirm, enter the course code and the semester of the course that you wish to drop.</span>
          <span className="text-red-600"><b>Warning:</b> This action can <b>NOT</b> be undone</span>
        </div>
        <div className="flex gap-4">
          <SingleLineInput ref={courseCodeInputRef} label="Course code" />
          <SingleLineInput ref={semesterInputRef} label="Semester" acceptSpace />
        </div>
        <div className="flex gap-4">
          <button className="btn-primary bg-red-600 border-red-600 hover:text-red-600" onClick={() => {
            const enteredCourseCode = courseCodeInputRef.current.getValue();
            const enteredSemester = semesterInputRef.current.getValue()
            if (enteredCourseCode !== courseCode) courseCodeInputRef.current.setValidationState(false);
            if (enteredSemester !== courseSemester) semesterInputRef.current.setValidationState(false);
            if (enteredCourseCode === courseCode && enteredSemester === courseSemester) {
              dropCourse(courseId).then((result) => {
                if (result.success) {
                  onSuccess();
                }
                else {
                  alertRef.current.textContent = result.message;
                  alertRef.current.classList.remove("hidden");
                }
              })
            }
          }}>Confirm</button>
          <button className="btn-secondary" onClick={() => showDropCourseModalSet(false)}>Cancel</button>
        </div>
      </ div>
    } />
  )
}
