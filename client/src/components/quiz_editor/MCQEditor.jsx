import { useEffect, useState } from "react";

export default function MCQEditor({
  allowMultipleAnswer,
  questionBody,
  onChange,
}) {
  const [optionList, optionListSet] = useState(questionBody.choices);
  const [questionDescription, questionDescriptionSet] = useState(
    questionBody.prompt
  );
  const [optionCount, optionCountSet] = useState(questionBody.choices.length);
  const [answerIdList, answerIdListSet] = useState([]);

  function addOption() {
    optionListSet([
      ...optionList,
      {
        id: String(optionCount),
        content: "",
      },
    ]);
    optionCountSet(optionCount + 1);
  }

  function removeOption(id) {
    optionListSet(optionList.filter((option) => id !== option.id));
    onChange({ prompt: questionDescription, choices: optionList });
  }

  function updateOption(id, content) {
    const updatedOptionList = optionList.map((option) => {
      if (option.id === id) {
        return { ...option, content: content };
      }
      return option;
    });
    optionListSet(updatedOptionList);
  }

  function addanswerIdList(id) {
    if (allowMultipleAnswer) answerIdListSet([...answerIdList, id]);
    else answerIdListSet([id]);
  }

  function removeanswerIdList(id) {
    answerIdListSet(answerIdList.filter((aId) => aId !== id));
  }

  function toggleAnswerIdList(id) {
    if (answerIdList.includes(id)) {
      removeanswerIdList(id);
    } else {
      addanswerIdList(id);
    }
  }

  useEffect(() => {
    onChange({
      prompt: questionDescription,
      choices: optionList,
      answers: answerIdList,
    });
  }, [onChange, questionDescription, optionList, answerIdList]);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <textarea
        className="border w-full px-5 py-4 rounded-md outline-none resize-none focus:ring focus:ring-blue-200 transition-all hover:bg-gray-50 cursor-pointer focus:cursor-auto focus:bg-white read-only:border-transparent read-only:ring-transparent"
        placeholder="Question description"
        defaultValue={questionDescription}
        onInput={(e) => {
          questionDescriptionSet(e.target.value);
        }}
        required
      ></textarea>
      {optionList.map((option, idx) => {
        return (
          <OptionInput
            option={option}
            placeholder={`Option ${idx + 1}`}
            isAnswer={answerIdList.includes(option.id)}
            toggleAnswerIdList={toggleAnswerIdList}
            removeOption={removeOption}
            onInput={(e) => {
              updateOption(option.id, e.target.value);
            }}
            key={option.id}
          />
        );
      })}
      <div className="flex gap-4">
        <button
          type="button"
          className="btn-outline w-fit text-start text-sm px-4 py-2 mt-2"
          onClick={addOption}
        >
          + Add option
        </button>
      </div>
    </div>
  );
}

function OptionInput({
  option,
  placeholder,
  isAnswer,
  toggleAnswerIdList,
  removeOption,
  onInput,
}) {
  return (
    <div className="relative group">
      <input
        type="checkbox"
        className="hidden peer"
        checked={isAnswer}
        readOnly
      />
      <input
        className="border rounded-md px-5 py-2 outline-none focus:outline-none focus:ring focus:ring-blue-200 transition-all hover:bg-gray-50 cursor-pointer focus:cursor-auto focus:bg-white read-only:border-transparent read-only:ring-transparent w-full peer-checked:border-green-600"
        placeholder={placeholder}
        defaultValue={option.content}
        onInput={onInput}
        autoFocus={option.id !== "0"}
        required
      />
      <div
        title="Set as answer"
        className="absolute h-6 w-6 flex items-center justify-center invisible group-hover:visible peer-checked:visible peer-checked:text-green-600 right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-gray-100 transition-all rounded-lg cursor-pointer"
        onClick={() => {
          toggleAnswerIdList(option.id);
        }}
      >
        {/* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */}
        <svg
          key="check"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      <div
        title="Remove option"
        className="absolute h-6 w-6 flex items-center justify-center right-2 top-1/2 -translate-y-1/2 text-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-all cursor-pointer"
        onClick={() => {
          if (removeOption) removeOption(option.id);
        }}
      >
        {/* [Credit]: svg from https://heroicons.dev */}
        <svg
          className="h-4"
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
      </div>
    </div>
  );
}
