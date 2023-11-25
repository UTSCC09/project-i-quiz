import SimpleCheckBox from "components/elements/SimpleCheckBox";
import { useEffect, useState } from "react";

export default function OEQEditor({ questionBody, onChange }) {
  const [questionDescription, questionDescriptionSet] = useState(
    questionBody.prompt
  );
  const [maxLengthToggle, maxLengthToggleSet] = useState(
    questionBody.hasOwnProperty("maxLength") && questionBody.maxLength !== 0
  );
  const [maxLength, maxLengthSet] = useState(questionBody.maxLength ?? 0);

  useEffect(() => {
    onChange({
      prompt: questionDescription,
      maxLength: maxLengthToggle ? maxLength : 0,
    });
  }, [onChange, questionDescription, maxLengthToggle, maxLength]);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <textarea
        className="border w-full px-5 py-4 rounded-md outline-none resize-none focus:ring ring-blue-200 transition-all hover:bg-gray-50 cursor-pointer focus:cursor-auto focus:bg-white read-only:border-transparent read-only:ring-transparent"
        placeholder="Question description"
        defaultValue={questionDescription}
        onInput={(e) => {
          questionDescriptionSet(e.target.value);
        }}
        required
      ></textarea>
      <div className="flex items-center h-6 gap-2 text-gray-700">
        <SimpleCheckBox
          label="Limit answer length"
          isChecked={maxLengthToggle}
          isCheckedSet={maxLengthToggleSet}
        />
        {maxLengthToggle && (
          <input
            type="number"
            defaultValue={maxLength}
            onInput={(e) => maxLengthSet(Number(e.target.value))}
            className="border rounded-md py-1 px-2 w-16 outline-none focus:ring ring-blue-200 transition-all"
            required
          />
        )}
      </div>
    </div>
  );
}
