import NavBar from "components/page_components/NavBar";
import QuestionEditor from "components/quiz_editor/QuestionEditor";
import { useCallback, useState } from "react";

export default function QuizEditorPage() {
  const [questionList, questionListSet] = useState([]);
  const [questionCount, questionCountSet] = useState(0);

  function addQuestion() {
    questionListSet([
      ...questionList,
      {
        id: questionCount,
        type: "MCQ",
        question: {
          prompt: "",
          choices: [{ id: 0, content: "" }],
        },
      },
    ]);
    questionCountSet(questionCount + 1);
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

  window.onbeforeunload = () => {
    return "";
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen w-full bg-gray-100 -z-50 flex flex-col items-center">
        <div className="px-8 md:px-24 w-full lg:w-[64rem] py-36 flex flex-col gap-6">
          {questionList.map((question, idx) => {
            return (
              <QuestionEditor
                questionObject={question}
                updateQuestion={updateQuestion}
                key={idx}
              />
            );
          })}
          <button
            className="btn-outline w-fit text-start text-sm px-4 py-2 mt-2"
            onClick={() => {
              addQuestion();
            }}
          >
            + Add question
          </button>
          <button onClick={() => console.log(JSON.stringify(questionList))}>
            Print
          </button>
        </div>
      </div>
    </>
  );
}
