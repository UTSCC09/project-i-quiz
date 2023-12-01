import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CheckBoxGroup(props) {
  const optionDictInit = {};
  props.options.forEach((option) => {
    optionDictInit[option.id] = props.checkedOptions.includes(option.id);
  });

  const [optionDict, setOptionDict] = useState(optionDictInit);

  function onOptionChange(oid) {
    setOptionDict((prevDict) => {
      const updatedDict = { ...prevDict, [oid]: !prevDict[oid] };
      const selectedOptions = Object.keys(updatedDict).filter(
        (key) => updatedDict[key]
      );
      props.updateQuestionResponse(props.checkBoxGroupName, selectedOptions);
      return updatedDict;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {props.options.map((option) => {
        return (
          <CheckOption
            checkBoxGroupName={props.checkBoxGroupName}
            oid={option.id}
            text={option.content}
            key={option.id}
            optionDict={optionDict}
            onOptionChange={onOptionChange}
          ></CheckOption>
        );
      })}
    </div>
  );
}

function CheckOption(props) {
  const checkIconVariants = {
    unchecked: { pathLength: 0, opacity: 0, transition: { duration: 0.1 } },
    checked: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } },
  };
  const labelTextVariant = {
    unchecked: { x: 0, transition: { duration: 0.1 } },
    checked: { x: "14px", transition: { duration: 0.2 } },
  };

  return (
    <div>
      <input
        type="checkbox"
        id={props.oid}
        name={props.checkBoxGroupName}
        value={props.oid}
        checked={props.optionDict[props.oid]}
        onChange={() => props.onOptionChange(props.oid)}
        className="peer hidden [&:checked_+_label_span]:font-medium"
      />
      <AnimatePresence initial={false}>
        <label
          htmlFor={props.oid}
          className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-white p-4 drop-shadow-sm hover:border-gray-200 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500 peer-checked:bg-blue-10 peer-checked:font-medium"
        >
          <div>
            {/* [Credit]: svg from https://codesandbox.io/p/sandbox/framer-motion-checkbox-animation-2cf2jn */}
            <motion.svg
              key="check"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="5"
              stroke="currentColor"
              className="h-3.5 w-3.5 text-iquiz-blue"
              initial={"unchecked"}
              animate={props.optionDict[props.oid] ? "checked" : "unchecked"}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
                variants={checkIconVariants}
              />
            </motion.svg>
          </div>
          <motion.div
            animate={props.optionDict[props.oid] ? "checked" : "unchecked"}
            variants={labelTextVariant}
            className="text-sm sm:text-base break-words pr-4"
            dangerouslySetInnerHTML={{
              __html: props.text,
            }}
          ></motion.div>
        </label>
      </AnimatePresence>
    </div>
  );
}
