import DropdownSelection from "components/elements/DropdownSelection";
import { useState, useCallback } from "react";
import MCQEditor from "./MCQEditor";
import OEQEditor from "./OEQEditor";

export default function QuestionEditor({
  questionObject,
  updateQuestion,
  updateMaxScore,
}) {
  const [questionType, questionTypeSet] = useState(questionObject.type);

  const onChange = useCallback(
    (newQuestionBody) => {
      updateQuestion({
        ...newQuestionBody,
        type: questionType,
        _id: questionObject._id,
        maxScore: questionObject.maxScore,
      });
    },
    [questionObject.maxScore, questionObject._id, questionType, updateQuestion]
  );

  const questionTypeNames = [
    "Multiple-Choice",
    "Multiple-Select",
    "Open-Ended",
  ];

  const questionTypeCodes = ["MCQ", "MSQ", "OEQ"];

  function questionTypeNameToCode(typeName) {
    const idx = questionTypeNames.findIndex((name) => name === typeName);
    if (idx === -1) return;
    return questionTypeCodes[idx];
  }

  function questionTypeCodeToName(typeCode) {
    const idx = questionTypeCodes.findIndex((code) => code === typeCode);
    if (idx === -1) return;
    return questionTypeNames[idx];
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <DropdownSelection
          selections={questionTypeNames}
          selection={questionTypeCodeToName(questionType)}
          width="150px"
          label="Question type"
          onSelectionChange={(questionTypeName) => {
            const newTypeCode = questionTypeNameToCode(questionTypeName);
            questionTypeSet(newTypeCode);
            if (newTypeCode) {
              onChange({
                prompt: questionObject.prompt,
                choices: questionObject.choices ?? [{ id: "0", content: "" }],
              });
            }
          }}
        />
        <span className="text-sm py-2">Max Score:</span>
        <input
          className="simple-input w-12"
          name="maxScore"
          defaultValue={questionObject.maxScore}
          onChange={(e) => {
            updateMaxScore(questionObject._id, e.target.value);
          }}
        />
      </div>
      {questionType === "OEQ" ? (
        <OEQEditor questionBody={questionObject} onChange={onChange} />
      ) : questionType === "MCQ" || questionType === "MSQ" ? (
        <MCQEditor
          allowMultipleAnswer={questionType === "MSQ"}
          questionBody={questionObject}
          onChange={onChange}
        />
      ) : (
        <>Unsupported question type</>
      )}
    </div>
  );
}
