import { fetchCourseObject, fetchInstructedCourses } from "api/CourseApi";
import { createQuiz, deleteDraftQuiz, getQuiz, updateQuiz } from "api/QuizApi";
import DropdownSelection from "components/elements/DropdownSelection";
import { ChevronIcon, XMarkIcon } from "components/elements/SVGIcons";
import Toast from "components/elements/Toast";
import JSONImportModal from "components/page_components/JSONImportModal";
import NavBar from "components/page_components/NavBar";
import QuizReleaseModal from "components/page_components/QuizReleaseModal";
import QuestionEditor from "components/question_editor_components/QuestionEditor";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import ObjectID from "bson-objectid";
import Modal from "components/elements/Modal";
import AlertBanner from "components/elements/AlertBanner";

export default function QuizEditorPage() {
  const location = useLocation();
  const { passInCourseObject } = location.state ?? {};
  const { quizId } = useParams();

  const navigate = useNavigate();

  const [courseObject, courseObjectSet] = useState(passInCourseObject ?? {});
  const [questionList, questionListSet] = useState([
    {
      _id: ObjectID().toHexString(),
      type: "MCQ",
      prompt: "",
      choices: [{ id: "0", content: "" }],
    },
  ]);
  const [quizReleaseModalShow, quizReleaseModalShowSet] = useState(false);
  const [quizEditSaveModalShow, quizEditSaveModalShowSet] = useState(false);
  const [quizDeleteModalShow, quizDeleteModalShowSet] = useState(false);
  const [jsonImportModalShow, jsonImportModalShowSet] = useState(false);
  const [quizIsDraft, quizIsDraftSet] = useState(true);
  const [activeCourseList, activeCourseListSet] = useState();
  const [quizName, quizNameSet] = useState("");
  const [quizCreationData, quizCreationDataSet] = useState({});
  const [toastMessage, toastMessageSet] = useState();
  const alertRef = useRef();

  function addQuestion() {
    questionListSet([
      ...questionList,
      {
        _id: ObjectID().toHexString(),
        type: "MCQ",
        prompt: "",
        choices: [{ id: "0", content: "" }],
      },
    ]);
  }

  function removeQuestion(id) {
    questionListSet(questionList.filter((question) => question._id !== id));
  }

  function moveQuestion(targetQuestion, idx, isMoveUp) {
    let tempQuestionList = questionList;
    tempQuestionList = tempQuestionList.filter(
      (question) => question._id !== targetQuestion._id
    );
    tempQuestionList.splice(isMoveUp ? idx - 1 : idx + 1, 0, targetQuestion);
    questionListSet(tempQuestionList);
  }

  const updateQuestion = useCallback(
    (newQuestion) => {
      questionListSet((questionList) =>
        questionList.map((questionObject) => {
          if (questionObject._id === newQuestion._id) {
            return newQuestion;
          }
          return questionObject;
        })
      );
    },
    [questionListSet]
  );

  function validateInputs() {
    let validationFlag = true;
    [...document.querySelectorAll("input")]
      .concat([...document.querySelectorAll("textarea")])
      .forEach((input) => {
        input.addEventListener("input", (e) => {
          e.target.classList.remove("input-invalid-state");
        });
        if (input.value === "") {
          validationFlag = false;
          input.classList.add("input-invalid-state");
        }
      });
    if (!validationFlag) {
      toastMessageSet(
        "Please fill out all fields, or remove any unwanted questions and choices"
      );
      setTimeout(() => {
        toastMessageSet();
      }, 3000);
    }
    return validationFlag;
  }

  useEffect(() => {
    if (quizId) {
      getQuiz(quizId).then((quizPayload) => {
        if (!quizPayload) {
          navigate("/page-not-found");
          return;
        }
        quizIsDraftSet(quizPayload.isDraft);
        questionListSet(quizPayload.questions);
        quizNameSet(quizPayload.quizName);
        fetchCourseObject(quizPayload.courseId).then((result) => {
          if (result.success) {
            courseObjectSet(result.payload);
          }
        });
      });
    }
  }, [quizId, questionListSet, navigate]);

  useEffect(() => {
    fetchInstructedCourses().then((payload) => {
      const filteredPayload = payload.filter(
        (course) => course.archived === false
      );
      activeCourseListSet(filteredPayload);
    });
  }, [activeCourseListSet, courseObject, courseObjectSet, location.state]);

  useEffect(() => {
    quizCreationDataSet({
      quizName: quizName,
      course: courseObject.courseId,
      questions: questionList,
    });
  }, [quizName, questionList, courseObject.courseId]);

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
      <NavBar />
      <Toast toastMessage={toastMessage} toastMessageSet={toastMessageSet} />
      <Modal
        modalShow={quizEditSaveModalShow}
        modalShowSet={quizEditSaveModalShowSet}
        content={
          <div className="flex flex-col sm:w-96 gap-6">
            <h1 className="text-2xl font-bold">Saving changes</h1>
            <AlertBanner ref={alertRef} />
            <div className="flex flex-col gap-4 text-gray-600">
              <span>
                Are you sure you want to save changes for <b>{quizName}</b> in{" "}
                <b>
                  {courseObject.courseCode} {courseObject.courseSemester}
                </b>
                ?
              </span>
            </div>
            <div className="flex gap-4 mt-2">
              <button
                className="btn-primary"
                onClick={() => {
                  alertRef.current.hide();
                  updateQuiz({
                    ...quizCreationData,
                    quizId: quizId,
                  }).then((result) => {
                    if (result.success) {
                      quizEditSaveModalShowSet(false);
                      toastMessageSet(
                        "Your changes have been saved successfully"
                      );
                      setTimeout(() => {
                        toastMessageSet();
                      }, 3000);
                    } else {
                      alertRef.current.setMessage(
                        "Changes cannot be saved: " + result.message
                      );
                      alertRef.current.show();
                    }
                  });
                }}
              >
                Confirm
              </button>
              <button
                className="btn-secondary"
                onClick={() => quizEditSaveModalShowSet(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        }
      />
      <Modal
        modalShow={quizDeleteModalShow}
        modalShowSet={quizDeleteModalShowSet}
        content={
          <div className="flex flex-col sm:w-96 gap-6">
            <h1 className="text-2xl font-bold">Deleting draft quiz</h1>
            <AlertBanner ref={alertRef} />
            <div className="flex flex-col gap-4 text-gray-600">
              <span>
                Are you sure you want to delete the draft quiz{" "}
                <b>{quizName}</b> in{" "}
                <b>
                  {courseObject.courseCode} {courseObject.courseSemester}
                </b>
                ?
              </span>
              <span className="mt-2 text-red-600">
                <b>Warning:</b> This action can <b>NOT</b> be undone.
              </span>
            </div>
            <div className="flex gap-4 mt-2">
              <button
                className="btn-primary bg-red-600 border-red-600 hover:text-red-600 focus:ring-red-200"
                onClick={() => {
                  alertRef.current.hide();
                  deleteDraftQuiz(quizId).then((result) => {
                    if (result.success) {
                      navigate("/course/" + courseObject.courseId, {
                        state: {
                          passInMessage: `Draft quiz "${quizName}" has been deleted`,
                        },
                      });
                    } else {
                      alertRef.current.setMessage(
                        "Could not delete quiz: " + result.message
                      );
                      alertRef.current.show();
                    }
                  });
                }}
              >
                Confirm
              </button>
              <button
                className="btn-secondary"
                onClick={() => quizDeleteModalShowSet(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        }
      />
      <QuizReleaseModal
        modalShow={quizReleaseModalShow}
        modalShowSet={quizReleaseModalShowSet}
        quizData={quizCreationData}
        quizId={quizId}
        onSuccess={(quizName) => {
          navigate("/course/" + courseObject.courseId, {
            state: {
              passInMessage: `Quiz "${quizName}" has been released to your students`,
            },
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
          <div
            className="bg-white border-l-[12px] h-fit rounded-md shadow-sm"
            style={{ borderLeftColor: courseObject.accentColor }}
          >
            <div className="relative border-l-0 h-full w-full py-4 sm:py-8 border pl-5 sm:pl-9 lg:pl-[52px] pr-8 sm:pr-12 lg:pr-16 flex items-center rounded-r-md">
              <div className="flex flex-col w-full items-end md:flex-row md:justify-between gap-4 sm:gap-8">
                <div className="border-b focus-within:border-b-blue-600 transition w-full">
                  <input
                    placeholder="Quiz Title"
                    defaultValue={quizName}
                    onInput={(e) => quizNameSet(e.target.value)}
                    className="px-2 py-2 text-lg font-semibold outline-none rounded-md w-full"
                    required
                  />
                </div>
                <DropdownSelection
                  width="12rem"
                  height="3rem"
                  selection={
                    courseObject.courseCode && courseObject.courseSemester
                      ? `${courseObject.courseCode} ${courseObject.courseSemester}`
                      : ""
                  }
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
          </div>
          {questionList.map((question, idx) => {
            return (
              <div
                className="relative bg-white h-fit py-8 sm:py-12 px-8 sm:px-12 lg:px-16 rounded-md shadow-sm flex flex-col border"
                key={question._id}
              >
                <span className="font-semibold text-xs uppercase text-gray-500 mb-6 ml-1">
                  Question {idx + 1} / {questionList.length}
                </span>
                <QuestionEditor
                  questionObject={question}
                  updateQuestion={updateQuestion}
                />
                <div className="absolute flex gap-8 right-6 top-6">
                  {/* Move up & down buttons */}
                  {questionList.length > 1 && (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        title="Move up"
                        className="h-8 w-8 flex items-center justify-center text-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-all rotate-180"
                        onClick={() => {
                          moveQuestion(question, idx, true);
                        }}
                      >
                        <ChevronIcon className="h-4" />
                      </button>
                      <button
                        type="button"
                        title="Move down"
                        className="h-8 w-8 flex items-center justify-center text-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
                        onClick={() => {
                          moveQuestion(question, idx, false);
                        }}
                      >
                        <ChevronIcon className="h-4" />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    title="Remove question"
                    className="h-8 w-8 flex items-center justify-center text-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
                    onClick={() => {
                      removeQuestion(question._id);
                    }}
                  >
                    <XMarkIcon className="h-6" />
                  </button>
                </div>
              </div>
            );
          })}
          <div className="flex flex-col lg:flex-row justify-between px-2 gap-4">
            <div className="flex gap-4">
              <button
                type="button"
                className="btn-outline w-fit text-start text-sm px-4 py-2"
                onClick={() => {
                  addQuestion();
                }}
              >
                + Add question
              </button>
              <button
                type="button"
                className="btn-outline w-fit text-start text-sm px-4 py-2"
                onClick={() => jsonImportModalShowSet(true)}
              >
                Import JSON
              </button>
            </div>
            <div className="flex gap-4">
              {quizId && !quizIsDraft && (
                <button
                  className="btn-primary w-fit text-start text-sm px-4 py-2 mt-2"
                  onClick={() => {
                    if (validateInputs()) {
                      quizEditSaveModalShowSet(true);
                    }
                  }}
                >
                  Save changes
                </button>
              )}
              {quizIsDraft && (
                <>
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
                        if (quizId) {
                          updateQuiz({
                            ...quizCreationData,
                            quizId: quizId,
                          }).then(() => {
                            quizReleaseModalShowSet(true);
                          });
                        }
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
                  <button
                    className="btn-secondary w-fit text-start text-sm px-4 py-2 mt-2 text-gray-800 bg-gray-200 border-gray-200"
                    onClick={() => {
                      if (validateInputs()) {
                        if (quizId) {
                          quizEditSaveModalShowSet(true);
                        } else {
                          createQuiz({
                            ...quizCreationData,
                            isDraft: true,
                          }).then((result) => {
                            if (result.success) {
                              navigate("/quiz/" + result.payload._id, {
                                state: {
                                  passInMessage: `Quiz "${quizName}" has been saved as draft`,
                                },
                              });
                            }
                          });
                        }
                      }
                    }}
                  >
                    Save {quizId ? "changes" : "as draft"}
                  </button>
                  <button
                    className="btn-outline border-red-600 text-red-600 hover:bg-red-600 focus:ring-red-200 w-fit text-start text-sm px-4 py-2 mt-2"
                    onClick={() => {
                      quizDeleteModalShowSet(true);
                    }}
                  >
                    Delete draft
                  </button>
                </>
              )}
            </div>

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
