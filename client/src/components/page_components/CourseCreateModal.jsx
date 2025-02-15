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
import { QuestionMarkCircleIcon } from "components/elements/SVGIcons";

export default function CourseCreateModal({
  modalShow,
  modalShowSet,
  onSuccess,
}) {
  const [step, stepSet] = useState(0);
  const courseCreationData = useRef({});

  return (
    <Modal
      modalShow={modalShow}
      modalShowSet={modalShowSet}
      onClose={() => stepSet(0)}
      content={
        <div className="w-full sm:w-96">
          {step === 0 && (
            <CourseCreationInfoForm
              courseCreationData={courseCreationData}
              next={() => stepSet(1)}
            />
          )}
          {step === 1 && (
            <AccessCodeForm
              courseCreationData={courseCreationData}
              next={() => stepSet(2)}
            />
          )}
          {step === 2 && (
            <AccentColorForm
              courseCreationData={courseCreationData}
              onSuccess={onSuccess}
              close={() => {
                modalShowSet(false);
                stepSet(0);
              }}
            />
          )}
        </div>
      }
    />
  );
}

function CourseCreationInfoForm({ courseCreationData, next }) {
  const alertRef = useRef();
  const semesterDropdownRef = useRef();
  const yearDropdownRef = useRef();
  const courseNameInputRef = useRef();
  const courseCodeInputRef = useRef();
  const sessionNumInputRef = useRef();
  const [year, yearSet] = useState();
  const [semester, semesterSet] = useState();
  const [helpMessageShow, helpMessageShowSet] = useState(false);

  async function submitCreateCourseForm(e) {
    e.preventDefault();

    /* Validation */
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

    /* Read form data */
    const formData = new FormData(e.target);

    formData.forEach((value, key) => {
      courseCreationData.current[key] = value;
    });

    if (!courseCreationData.current["numOfSessions"]) {
      courseCreationData.current["numOfSessions"] = 1;
    } else if (courseCreationData.current["numOfSessions"] < 0) {
      alertRef.current.setMessage("Number of sections cannot be negative");
      alertRef.current.show();
      return;
    }

    /* Check course availability to avoid duplicates */
    checkNewCourseAvailability(
      courseCreationData.current.courseCode,
      courseCreationData.current.courseName,
      courseCreationData.current.courseSemester
    ).then((result) => {
      if (result.success) {
        alertRef.current.hide();
        next();
      } else {
        alertRef.current.setMessage(result.message);
        alertRef.current.show();
      }
    });
  }

  return (
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
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
            <div className="w-full">
              <SingleLineInput
                ref={courseCodeInputRef}
                name="courseCode"
                label="Course code"
              />
            </div>
            <div className="flex gap-2 h-11 w-full sm:h-auto">
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
                width="4.75rem"
              />
              <input
                className="hidden"
                name="courseSemester"
                value={semester + " " + year}
                readOnly
              />
            </div>
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
              <QuestionMarkCircleIcon className="h-3.5" />
            </div>

            <AnimatePresence>
              {helpMessageShow && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute z-10 text-sm text-slate-600 flex flex-col gap-4 bg-white py-6 px-8 shadow-lg max-w-full sm:w-80 rounded-lg right-12 bottom-0"
                >
                  <span>
                    Having multiple sections allows you to split students into
                    groups, which you could assign different quizzes to.
                  </span>
                  <span>
                    If you don't plan to use this feature, leave this field
                    blank. You will still be able to modify the number of
                    sections later.
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
  );
}

function AccessCodeForm({ courseCreationData, next }) {
  const accessCodeInputRef = useRef();
  const alertRef = useRef();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Set course access code</h1>
      <AlertBanner ref={alertRef} />
      <div className="text-gray-600 flex flex-col gap-4">
        <span>
          A unique course access code is required. Students will use this code
          to access your course.
        </span>
        <span>
          You may click on the dice icon to randomly generate an access code.
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
          courseCreationData.current["accessCode"] = accessCode;
          next();
        }}
      >
        Next
      </button>
    </div>
  );
}

function AccentColorForm({ courseCreationData, onSuccess, close }) {
  const alertRef = useRef();
  const [colorPicked, colorPickedSet] = useState();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <div>Pick a color for {courseCreationData.current.courseCode}</div>
        <Badge
          label={courseCreationData.current.courseSemester}
          accentColor={colorPicked}
        />
      </h1>
      <AlertBanner ref={alertRef} />
      <div className="flex flex-col gap-4 text-gray-600">
        <span>Pick an accent color for your newly created course.</span>
        <span>Don't worry, you will be able to change it at anytime.</span>
      </div>
      <ColorPicker colorPicked={colorPicked} colorPickedSet={colorPickedSet} />
      <button
        className="btn-primary"
        style={{
          opacity: colorPicked ? 1 : 0.4,
          pointerEvents: colorPicked ? "auto" : "none",
        }}
        onClick={() => {
          courseCreationData.current["accentColor"] = colorPicked;
          createCourse(courseCreationData.current).then((result) => {
            if (result.success) {
              onSuccess(
                result.payload.courseCode,
                result.payload.courseSemester
              );
              close();
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
  );
}
