import { fetchInstructedCourses } from "api/CourseApi";
import DropdownSelection from "components/elements/DropdownSelection";
import Toast from "components/elements/Toast";
import JSONImportModal from "components/page_components/JSONImportModal";
import NavBar from "components/page_components/NavBar";
import QuizReleaseModal from "components/page_components/QuizReleaseModal";
import QuestionEditor from "components/quiz_editor/QuestionEditor";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function QuizEditorPage() {
  const location = useLocation();
  const { passInCourseObject } = location.state ?? {};

  const navigate = useNavigate();

  const [courseObject, courseObjectSet] = useState(passInCourseObject);
  const [questionList, questionListSet] = useState([
    {
      id: "0",
      type: "MCQ",
      question: {
        prompt: "",
        choices: [{ id: "0", content: "" }],
      },
    },
  ]);
  const [questionIdCounter, questionIdCounterSet] = useState(1);
  const [quizReleaseModalShow, quizReleaseModalShowSet] = useState(false);
  const [jsonImportModalShow, jsonImportModalShowSet] = useState(false);
  const [activeCourseList, activeCourseListSet] = useState();
  const [quizName, quizNameSet] = useState("");
  const [quizCreationData, quizCreationDataSet] = useState({});
  const [toastMessage, toastMessageSet] = useState();

  function addQuestion() {
    questionListSet([
      ...questionList,
      {
        id: String(questionIdCounter),
        type: "MCQ",
        question: {
          prompt: "",
          choices: [{ id: "0", content: "" }],
        },
      },
    ]);
    questionIdCounterSet(questionIdCounter + 1);
  }

  function removeQuestion(id) {
    questionListSet(questionList.filter((question) => question.id !== id));
  }

  const updateQuestion = useCallback(
    (newQuestion) => {
      questionListSet((questionList) =>
        questionList.map((questionObject) => {
          if (questionObject.id === newQuestion.id) {
            return newQuestion;
          }
          return questionObject;
        })
      );
    },
    [questionListSet]
  );

  useEffect(() => {
    fetchInstructedCourses().then((payload) => {
      const filteredPayload = payload.filter(
        (course) => course.archived === false
      );
      activeCourseListSet(filteredPayload);
      if (!courseObject) courseObjectSet(filteredPayload[0]);
    });
  }, [activeCourseListSet, courseObject, courseObjectSet, location.state]);

  useEffect(() => {
    quizCreationDataSet({
      quizName: quizName,
      course: courseObject.courseId,
      questions: questionList,
    });
  }, [quizName, courseObject.courseId, questionList]);

  return (
    <>
      <NavBar />
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <QuizReleaseModal
        modalShow={quizReleaseModalShow}
        modalShowSet={quizReleaseModalShowSet}
        quizData={quizCreationData}
        onSuccess={(quizName) => {
          navigate("/course/" + courseObject.courseId, {
            state: { passInMessage: `Quiz "${quizName}" has been created` },
          });
        }}
      />
      <JSONImportModal
        modalShow={jsonImportModalShow}
        modalShowSet={jsonImportModalShowSet}
        questionListSet={questionListSet}
      />
      <div className="min-h-screen w-full bg-gray-100 -z-50 flex flex-col items-center">
        <div className="px-8 md:px-24 w-full lg:w-[64rem] py-36 flex flex-col gap-6">
          <div className="relative bg-white h-fit py-8 px-8 sm:px-12 lg:px-16 rounded-md shadow-sm">
            <div className="flex flex-col items-end md:flex-row md:justify-between gap-8">
              <div className="border-b focus-within:border-b-blue-600 transition w-full">
                <input
                  placeholder="Quiz Title"
                  defaultValue={quizName}
                  onInput={(e) => quizNameSet(e.target.value)}
                  className="px-2 py-2 text-lg outline-none rounded-md w-full"
                  required
                />
              </div>
              <DropdownSelection
                width="12rem"
                height="3rem"
                selection={`${courseObject.courseCode} ${courseObject.courseSemester}`}
                label={"Course"}
                selections={(activeCourseList ?? []).map(
                  (course) => `${course.courseCode} ${course.courseSemester}`
                )}
                onSelectionChange={(selection) => {
                  courseObjectSet(
                    activeCourseList.find(
                      (course) =>
                        `${course.courseCode} ${course.courseSemester}` ===
                        selection
                    )
                  );
                }}
              />
            </div>
          </div>
          {questionList.map((question, idx) => {
            return (
              <div
                className="relative bg-white h-fit py-8 sm:py-12 px-8 sm:px-12 lg:px-16 rounded-md shadow-sm flex flex-col"
                key={question.id}
              >
                <span className="font-semibold text-xs uppercase text-gray-500 mb-6 ml-1">
                  Question {idx + 1} / {questionList.length}
                </span>
                <QuestionEditor
                  questionObject={question}
                  updateQuestion={updateQuestion}
                />
                <button
                  type="button"
                  title="Remove option"
                  className="absolute h-8 w-8 flex items-center justify-center right-6 top-6 text-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => {
                    removeQuestion(question.id);
                  }}
                >
                  {/* [Credit]: svg from https://heroicons.dev */}
                  <svg
                    className="h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    ></path>
                  </svg>
                </button>
              </div>
            );
          })}
          <div className="flex justify-between px-2">
            <div className="flex gap-4">
              <button
                type="button"
                className="btn-outline w-fit text-start text-sm px-4 py-2 mt-2"
                onClick={() => {
                  addQuestion();
                }}
              >
                + Add question
              </button>
              <button
                type="button"
                className="btn-outline w-fit text-start text-sm px-4 py-2 mt-2"
                onClick={() => jsonImportModalShowSet(true)}
              >
                Import JSON
              </button>
            </div>
            <button
              type="submit"
              className="btn-primary w-fit text-start text-sm px-4 py-2 mt-2"
              onClick={() => {
                let flag = true;
                [...document.querySelectorAll("input")]
                  .concat([...document.querySelectorAll("textarea")])
                  .forEach((input) => {
                    input.addEventListener("input", (e) => {
                      e.target.classList.remove("input-invalid-state");
                    });
                    if (input.value === "") {
                      flag = false;
                      input.classList.add("input-invalid-state");
                    }
                  });
                if (flag) {
                  quizReleaseModalShowSet(true);
                } else {
                  toastMessageSet(
                    "Please fill out all fields, or remove any unwanted questions and choices"
                  );
                  setTimeout(() => {
                    toastMessageSet();
                  }, 3000);
                }
              }}
            >
              Release quiz
            </button>
            {/* <button
              type="button"
              className="btn-outline w-fit text-start text-sm px-4 py-2 mt-2"
              onClick={() => console.log(JSON.stringify(quizCreationData))}
            >
              Print (DEBUG)
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
