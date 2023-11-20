import React, { useRef, useState } from "react";
import SingleLineInput from "components/elements/SingleLineInput";
import Modal from "components/elements/Modal";
import ColorPicker from "./ColorPicker";
import DropdownSelection from "components/elements/DropdownSelection";
import { AnimatePresence, motion } from "framer-motion";
import { checkNewCourseAvailability, createCourse } from "api/CourseApi";
import AccessCodeInput from "./AccessCodeInput";
import AlertBanner from "components/elements/AlertBanner";
import Badge from "components/elements/Badge";

export default function CourseCreateModal({
  modalShow,
  modalShowSet,
  onSuccess,
}) {
  const alertRef = useRef();
  const semesterDropdownRef = useRef();
  const courseNameInputRef = useRef();
  const courseCodeInputRef = useRef();
  const sessionNumInputRef = useRef();
  const accessCodeInputRef = useRef();
  const yearDropdownRef = useRef();

  const [step, stepSet] = useState(0);
  const [helpMessageShow, helpMessageShowSet] = useState(false);
  const [year, yearSet] = useState();
  const [semester, semesterSet] = useState();
  const [colorPicked, colorPickedSet] = useState();
  const [courseCodeTemp, courseCodeTempSet] = useState();
  const [courseSemesterTemp, courseSemesterTempSet] = useState();

  let courseCreationData = {}

  function resetAllStates() {
    stepSet(0);
    helpMessageShowSet(false);
    yearSet();
    semesterSet();
    colorPickedSet();
    courseCodeTempSet();
    courseSemesterTempSet();
    courseCreationData = {};
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
      alertRef.current.setMessage("Please fill out all required fields");
      alertRef.current.show();
      return;
    }

    alertRef.current.hide();

    const formData = new FormData(e.target);

    formData.forEach((value, key) => {
      courseCreationData[key] = value;
    });

    if (!courseCreationData["numOfSessions"]) {
      courseCreationData["numOfSessions"] = 1;
    } else if (courseCreationData["numOfSessions"] < 0) {
      alertRef.current.setMessage("Number of sections cannot be negative");
      alertRef.current.show();
      return;
    }
    checkNewCourseAvailability(
      courseCreationData.courseCode,
      courseCreationData.courseName,
      courseCreationData.courseSemester
    ).then((result) => {
      if (result.success) {
        alertRef.current.hide();
        courseCodeTempSet(courseCreationData.courseCode);
        courseSemesterTempSet(courseCreationData.courseSemester);
        stepSet(1);
      } else {
        alertRef.current.setMessage(result.message);
        alertRef.current.show();
      }
    });
  }

  return (
    <Modal
      modalShow={modalShow}
      modalShowSet={modalShowSet}
      onClose={() => {
        resetAllStates();
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
                <AlertBanner ref={alertRef} />
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
                      ref={sessionNumInputRef}
                      name="numOfSessions"
                      label="Number of sections (Optional)"
                      inputType="number"
                    />
                    <div
                      className="absolute z-10 text-black text-opacity-30 text-center right-2 top-1/2 p-2.5 -translate-y-1/2 cursor-pointer hover:bg-black hover:bg-opacity-5 rounded-lg transition-all"
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
                            If you don't plan to use this feature, leave this
                            field blank. You will still be able to modify the
                            number of sections later.
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
              <h1 className="text-2xl font-bold">Set course access code</h1>
              <AlertBanner ref={alertRef} />
              <div className="text-gray-600 flex flex-col gap-4">
                <span>
                  A unique course access code is required. Students will use
                  this code to access your course.
                </span>
                <span>
                  You may click on the dice icon to randomly generate an access
                  code.
                </span>
              </div>
              <AccessCodeInput inputRef={accessCodeInputRef} />
              <button
                className="btn-primary"
                onClick={() => {
                  const accessCode = accessCodeInputRef.current.getValue();
                  if (accessCode.length < 6) {
                    alertRef.current.setMessage(
                      "Course access code has to be at least 6 characters"
                    );
                    alertRef.current.show();
                    accessCodeInputRef.current.setValidationState(false);
                    return;
                  }
                  alertRef.current.hide();
                  courseCreationData["accessCode"] = accessCode;
                  stepSet(step + 1);
                }}
              >
                Next
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <div>Pick a color for {courseCodeTemp}</div>
                <Badge
                  label={courseSemesterTemp}
                  accentColor={colorPicked}
                />
              </h1>
              <AlertBanner ref={alertRef} />
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
                  courseCreationData["accentColor"] = colorPicked;
                  createCourse(courseCreationData).then((result) => {
                    if (result.success) {
                      onSuccess(
                        result.payload.courseCode,
                        result.payload.courseSemester
                      );
                      resetAllStates();
                      modalShowSet(false);
                    } else {
                      alertRef.current.setMessage(
                        "Course creation failed. Please try again later."
                      );
                      alertRef.current.show();
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
  );
}
