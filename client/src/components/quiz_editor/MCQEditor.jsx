import { CheckIcon, XMarkIcon } from "components/elements/SVGIcons";
import { useEffect, useState } from "react";

export default function MCQEditor({
  allowMultipleAnswer,
  questionBody,
  onChange,
}) {
  const [optionList, optionListSet] = useState(questionBody.choices ?? []);
  const [questionDescription, questionDescriptionSet] = useState(
    questionBody.prompt ?? ""
  );
  const [optionIdCounter, optionIdCounterSet] = useState(optionList.length);
  const [answerIdList, answerIdListSet] = useState(questionBody.answers ?? []);

  function addOption() {
    optionListSet([
      ...optionList,
      {
        id: String(optionIdCounter),
        content: "",
      },
    ]);
    optionIdCounterSet(optionIdCounter + 1);
  }

  function removeOption(id) {
    const updatedOptionList = optionList.filter((option) => id !== option.id);
    optionListSet(updatedOptionList);
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
        required
      />
      <div
        title="Set as answer"
        className="absolute h-6 w-6 flex items-center justify-center invisible group-hover:visible peer-checked:visible peer-checked:text-green-600 right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-gray-100 transition-all rounded-lg cursor-pointer"
        onClick={() => {
          toggleAnswerIdList(option.id);
        }}
      >
        <CheckIcon className="h-4" />
      </div>
      <div
        title="Remove option"
        className="absolute h-6 w-6 flex items-center justify-center right-2 top-1/2 -translate-y-1/2 text-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
        onClick={() => {
          if (removeOption) removeOption(option.id);
        }}
      >
        <XMarkIcon className="h-4" />
      </div>
    </div>
  );
}
