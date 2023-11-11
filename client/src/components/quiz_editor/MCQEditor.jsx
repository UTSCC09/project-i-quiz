import RadioGroup from "components/elements/RadioGroup";
import SimpleCheckBox from "components/elements/SimpleCheckBox";
import { useState } from "react";

export default function MCQEditor() {
  const [optionList, optionListSet] = useState([]);
  const [descContent, descContentSet] = useState("What is this question?");
  const [descEditable, descEditableSet] = useState(true);
  const [optionCount, optionCountSet] = useState(1);

  function addOption() {
    optionListSet([
      ...optionList,
      {
        id: optionCount,
        content: optionCount,
      },
    ]);
    optionCountSet(optionCount + 1);
  }

  function removeOption(targetId) {
    optionListSet(optionList.filter((option) => targetId !== option.id));
  }

  return (
    <div className="flex flex-col gap-4 text-sm sm:text-base">
      <textarea
        className="border w-full px-6 py-4 rounded-md outline-none resize-none focus:ring ring-blue-200 transition-all placeholder-gray-500 hover:bg-gray-50 cursor-pointer focus:cursor-auto focus:bg-white read-only:border-transparent read-only:ring-transparent"
        placeholder="Question description"
        defaultValue={descContent}
      ></textarea>
      {optionList.map((option, idx) => {
        return (
          <OptionInput
            option={option}
            placeholder={`Option ${idx + 1}`}
            removeOption={removeOption}
            key={option.id}
          />
        );
      })}

      <button
        className="btn-outline w-fit text-start text-sm px-4 py-2 mt-2"
        onClick={addOption}
      >
        + Add option
      </button>
    </div>
  );
}

function OptionInput({ option, placeholder, removeOption }) {
  return (
    <div className="relative">
      <input
        className="border rounded-md px-6 py-4 outline-none focus:outline-none focus:ring ring-blue-200 transition-all hover:bg-gray-50 cursor-pointer focus:cursor-auto focus:bg-white read-only:border-transparent read-only:ring-transparent w-full"
        placeholder={placeholder}
      />
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rounded-lg p-1 cursor-pointer hover:bg-gray-100 transition-all"
        onClick={() => {
          if (removeOption) removeOption(option.id);
        }}
      >
        {/* [Credit]: svg from https://heroicons.dev */}
        <svg
          className="h-5"
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
