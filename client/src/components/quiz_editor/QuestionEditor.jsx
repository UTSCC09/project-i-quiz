import DropdownSelection from "components/elements/DropdownSelection";
import { useState, useCallback } from "react";
import MCQEditor from "./MCQEditor";
import OEQEditor from "./OEQEditor";

export default function QuestionEditor({ questionObject, updateQuestion }) {
  const [questionType, questionTypeSet] = useState(questionObject.type);

  const onChange = useCallback(
    (newQuestionBody) => {
      updateQuestion({
        id: questionObject.id,
        type: questionType,
        question: newQuestionBody,
      });
    },
    [questionObject.id, questionType, updateQuestion]
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
      <div className="flex gap-4 h-8 md:h-10">
        <DropdownSelection
          selections={questionTypeNames}
          selection={questionTypeCodeToName(questionType)}
          width="150px"
          onSelectionChange={(questionTypeName) => {
            const newTypeCode = questionTypeNameToCode(questionTypeName);
            questionTypeSet(newTypeCode);
            if (newTypeCode) {
              onChange({
                prompt: questionObject.question.prompt,
                choices: questionObject.question.choices ?? [
                  { id: "0", content: "" },
                ],
              });
            }
          }}
        />
      </div>
      {questionType === "OEQ" ? (
        <OEQEditor
          questionBody={questionObject.question}
          onChange={onChange}
        />
      ) : questionType === "MCQ" || questionType === "MSQ" ? (
        <MCQEditor
          allowMultipleAnswer={questionType === "MSQ"}
          questionBody={questionObject.question}
          onChange={onChange}
        />
      ) : (
        <>Unsupported question type</>
      )}
    </div>
  );
}
