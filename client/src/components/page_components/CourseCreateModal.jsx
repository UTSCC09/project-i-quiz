import React, { useRef, useState } from "react";
import SingleLineInput from "components/elements/SingleLineInput";
import Modal from "components/elements/Modal";
import ColorPicker from "./ColorPicker";
import DropdownSelection from "components/elements/DropdownSelection";
import { AnimatePresence, motion } from "framer-motion";
import { checkNewCourseAvailability, createCourse } from "api/CourseApi";

export default function CourseCreateModal({
  modalShow,
  modalShowSet,
  onSuccess,
}) {
  const alertRef = useRef();
  const semesterDropdownRef = useRef();
  const courseNameInputRef = useRef();
  const courseCodeInputRef = useRef();
  const sectionNumInputRef = useRef();
  const accessCodeInputRef = useRef();
  const yearDropdownRef = useRef();

  const [step, stepSet] = useState(0);
  const [helpMessageShow, helpMessageShowSet] = useState(false);
  const [year, yearSet] = useState();
  const [semester, semesterSet] = useState();
  const [colorPicked, colorPickedSet] = useState();
  const [courseCreationData, courseCreationDataSet] = useState({});

  function addCourseCreationData(key, value) {
    let newData = courseCreationData;
    newData[key] = value;
    courseCreationDataSet(newData);
  }

  async function submitCreateCourseForm(e) {
    e.preventDefault();
    let inputsValidated = courseNameInputRef.current.validate("required");
    inputsValidated =
      semesterDropdownRef.current.validate() && inputsValidated;
    inputsValidated = yearDropdownRef.current.validate() && inputsValidated;
    inputsValidated =
      courseCodeInputRef.current.validate("required") && inputsValidated;

    if (!inputsValidated) {
      alertRef.current.textContent = "Please fill out all fields";
      alertRef.current.classList.remove("hidden");
      return;
    }

    alertRef.current.classList.add("hidden");

    const formData = new FormData(e.target);
    formData.forEach((value, key) => addCourseCreationData(key, value));
    if (!courseCreationData["numOfSessions"]) {
      addCourseCreationData("numOfSessions", 1);
    }
    checkNewCourseAvailability(
      courseCreationData.courseCode,
      courseCreationData.courseName,
      courseCreationData.courseSemester
    ).then((result) => {
      if (result.success) {
        alertRef.current.classList.add("hidden");
        stepSet(1);
      } else {
        alertRef.current.textContent = result.message;
        alertRef.current.classList.remove("hidden");
      }
    });
  }

  return (
    modalShow && (
      <div
        className="fixed z-50 h-screen w-screen"
        onClick={() => {
          if (
            semesterDropdownRef.current &&
            semesterDropdownRef.current.dropdownShow
          ) {
            semesterDropdownRef.current.dropdownShowSet(false);
          }
          if (
            yearDropdownRef.current &&
            yearDropdownRef.current.dropdownShow
          ) {
            yearDropdownRef.current.dropdownShowSet(false);
          }
        }}
      >
        <Modal
          modalShow={modalShow}
          modalShowSet={modalShowSet}
          onClose={() => {
            stepSet(0);
            helpMessageShowSet(false);
            semesterSet();
            yearSet();
          }}
          content={
            <div className="sm:w-96">
              {/* --- Step 1 --- */}
              {step === 0 && (
                <div className="flex flex-col gap-6">
                  <h1 className="text-2xl font-bold">Create a new course</h1>
                  <span className="text-gray-600">
                    Please complete the course information
                  </span>
                  <form
                    autoComplete="off"
                    className="gap-6 flex flex-col"
                    onSubmit={submitCreateCourseForm}
                  >
                    <div
                      ref={alertRef}
                      className="rounded border-l-4 text-red-700 border-red-500 bg-red-50 p-4 text-sm col-span-6 hidden"
                    ></div>
                    <div className="relative flex flex-col gap-4">
                      <SingleLineInput
                        ref={courseNameInputRef}
                        name="courseName"
                        label="Course name"
                        acceptSpace
                      />
                      <div className="flex gap-2">
                        <DropdownSelection
                          ref={semesterDropdownRef}
                          label="Semester"
                          selections={["Fall", "Winter", "Summer"]}
                          selection={semester}
                          onSelectionChange={(selection) => {
                            semesterSet(selection);
                          }}
                          width="7rem"
                        />
                        <DropdownSelection
                          ref={yearDropdownRef}
                          label="Year"
                          selections={["22", "23", "24"]}
                          selection={year}
                          onSelectionChange={(selection) => {
                            yearSet(selection);
                          }}
                          width="4.5rem"
                        />
                        <input
                          className="hidden"
                          name="courseSemester"
                          value={semester + " " + year}
                          readOnly
                        />
                        <SingleLineInput
                          ref={courseCodeInputRef}
                          name="courseCode"
                          label="Course code"
                        />
                      </div>
                      <div className="relative">
                        <SingleLineInput
                          ref={sectionNumInputRef}
                          name="numOfSessions"
                          label="Number of sections (Optional)"
                          numberOnly
                        />
                        <div
                          className="absolute z-10 text-slate-400 text-center right-0 top-1/2 p-4 -translate-y-1/2 cursor-pointer hover:opacity-50 transition"
                          onClick={() => {
                            helpMessageShowSet(!helpMessageShow);
                          }}
                        >
                          {/* [Credit]: svg from https://www.flaticon.com/uicons */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            strokeWidth="0.5"
                            stroke="currentColor"
                            className="h-3.5 w-3.5"
                          >
                            <path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" />
                            <path d="M12.717,5.063A4,4,0,0,0,8,9a1,1,0,0,0,2,0,2,2,0,0,1,2.371-1.967,2.024,2.024,0,0,1,1.6,1.595,2,2,0,0,1-1,2.125A3.954,3.954,0,0,0,11,14.257V15a1,1,0,0,0,2,0v-.743a1.982,1.982,0,0,1,.93-1.752,4,4,0,0,0-1.213-7.442Z" />
                            <circle cx="12.005" cy="18" r="1" />
                          </svg>
                        </div>

                        <AnimatePresence>
                          {helpMessageShow && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              className="absolute z-10 text-sm text-slate-600 flex flex-col gap-4 bg-white py-6 px-8 shadow-lg w-80 rounded-lg right-12 bottom-0"
                            >
                              <span>
                                Having multiple sections allows you to split
                                students into groups, which you could assign
                                different quizzes to.
                              </span>
                              <span>
                                If you don't plan to use this feature, leave
                                this field blank. You will still be able to
                                modify the number of sections later.
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {helpMessageShow && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { duration: 0.1 },
                              }}
                              exit={{ opacity: 0 }}
                              className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-10"
                              onClick={() => {
                                helpMessageShowSet(false);
                              }}
                            ></motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <button className="btn-primary">Next</button>
                  </form>
                </div>
              )}
              {/* --- Step 2 --- */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <h1 className="text-2xl font-bold">
                    Set course access code
                  </h1>
                  <div className="text-gray-600 flex flex-col gap-4">
                    <span>
                      A unique course access code is required. Students will
                      use this code to access your course.
                    </span>
                    <span>
                      You may click on the dice icon to randomly generate an
                      access code.
                    </span>
                  </div>
                  <div className="relative">
                    <SingleLineInput
                      ref={accessCodeInputRef}
                      label="Course access code"
                    />
                    <div
                      className="absolute z-10 text-slate-500 text-center right-2 top-1/2 p-2.5 -translate-y-1/2 cursor-pointer hover:text-slate-600 hover:bg-gray-100 transition rounded-lg"
                      onClick={() => {
                        /* [Credit]: Random string generating function from https://stackoverflow.com/a/38622545 */
                        accessCodeInputRef.current.setValue(
                          Math.random().toString(36).slice(2, 8).toUpperCase()
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-4"
                        fill="currentColor"
                      >
                        <path d="M19,24H14a5.006,5.006,0,0,1-5-5V14a5.006,5.006,0,0,1,5-5h5a5.006,5.006,0,0,1,5,5v5A5.006,5.006,0,0,1,19,24ZM14,11a3,3,0,0,0-3,3v5a3,3,0,0,0,3,3h5a3,3,0,0,0,3-3V14a3,3,0,0,0-3-3Zm0,2a1,1,0,1,0,1,1A1,1,0,0,0,14,13Zm5,5a1,1,0,1,0,1,1A1,1,0,0,0,19,18ZM9,7A1,1,0,1,0,8,6,1,1,0,0,0,9,7ZM7,9a1,1,0,1,0-1,1A1,1,0,0,0,7,9Zm-.22,6.826a1,1,0,0,0-.154-1.405,3.15,3.15,0,0,1-.251-.228L2.864,10.634a3.005,3.005,0,0,1,.029-4.243L6.453,2.88a2.98,2.98,0,0,1,2.106-.864h.022a2.981,2.981,0,0,1,2.115.893L14.2,6.465c.057.058.111.117.163.179A1,1,0,1,0,15.9,5.356c-.083-.1-.17-.194-.266-.292L12.12,1.505a5,5,0,0,0-7.071-.049L1.489,4.967a5.007,5.007,0,0,0-.049,7.071L4.951,15.6a4.865,4.865,0,0,0,.423.381,1,1,0,0,0,1.406-.153Z" />
                      </svg>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    style={{
                      opacity: true ? 1 : 0.4,
                      pointerEvents: true ? "auto" : "none",
                    }}
                    onClick={() => {
                      addCourseCreationData(
                        "accessCode",
                        accessCodeInputRef.current.getValue()
                      );
                      stepSet(step + 1);
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <h1 className="text-2xl font-bold">Choose a color</h1>
                  <div
                    ref={alertRef}
                    className="rounded border-l-4 text-red-700 border-red-500 bg-red-50 p-4 text-sm col-span-6 hidden"
                  ></div>
                  <div className="flex flex-col gap-4 text-gray-600">
                    <span>
                      Pick an accent color for your newly created course.
                    </span>
                    <span>
                      Don't worry, you will be able to change it at anytime.
                    </span>
                  </div>
                  <ColorPicker
                    colorPicked={colorPicked}
                    colorPickedSet={colorPickedSet}
                  />
                  <button
                    className="btn-primary"
                    style={{
                      opacity: colorPicked ? 1 : 0.4,
                      pointerEvents: colorPicked ? "auto" : "none",
                    }}
                    onClick={() => {
                      addCourseCreationData("accentColor", colorPicked);
                      createCourse(courseCreationData).then((result) => {
                        if (result.success) {
                          onSuccess(
                            result.payload.courseCode,
                            result.payload.courseSemester
                          );
                        } else {
                          alertRef.current.textContent =
                            "Course creation failed. Please try again later.";
                          alertRef.current.classList.remove("hidden");
                        }
                      });
                    }}
                  >
                    Finish
                  </button>
                </div>
              )}
            </div>
          }
        />
      </div>
    )
  );
}
