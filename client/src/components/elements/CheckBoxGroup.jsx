import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "./SVGIcons";
import colors from "tailwindcss/colors";

export default function CheckBoxGroup(props) {
  const [correctOptionDict, correctOptionDictSet] = useState({});
  const [optionDict, setOptionDict] = useState({});

  function onOptionChange(oid) {
    setOptionDict((prevDict) => {
      const updatedDict = { ...prevDict, [oid]: !prevDict[oid] };
      const selectedOptions = Object.keys(updatedDict).filter(
        (key) => updatedDict[key]
      );
      if (props.updateQuestionResponse)
        props.updateQuestionResponse(props.checkBoxGroupName, selectedOptions);
      return updatedDict;
    });
  }

  useEffect(() => {
    if (props.correctOptionIds) {
      props.correctOptionIds.forEach((option) => {
        correctOptionDictSet((prev) => {
          return { ...prev, [option]: true };
        });
      });
    }
  }, [props.correctOptionIds]);

  useEffect(() => {
    if (props.checkedOptions) {
      props.checkedOptions.forEach((oid) => {
        setOptionDict((prevDict) => {
          const updatedDict = { ...prevDict, [oid]: true };
          return updatedDict;
        });
      });
    }
  }, [props.checkedOptions]);

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
            correctOptionDict={correctOptionDict}
          ></CheckOption>
        );
      })}
    </div>
  );
}

function CheckOption(props) {
  const hasCorrectOption =
    Object.keys(props.correctOptionDict ?? {}).length !== 0;
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
        checked={props.optionDict[props.oid] ?? false}
        onChange={() => {
          if (!hasCorrectOption) props.onOptionChange(props.oid);
        }}
        className="peer hidden [&:checked_+_label_span]:font-medium"
      />
      <AnimatePresence initial={false}>
        {props.correctOptionDict && props.correctOptionDict[props.oid] ? (
          <label className="flex items-center rounded-lg border bg-white p-4 shadow-sm  border-green-600 ring-1 ring-green-600 font-medium">
            <CheckIcon className="check-icon h-4 text-green-600 stroke-[4]" />
            <div
              className="ml-4 text-sm sm:text-base pr-4 break-words"
              dangerouslySetInnerHTML={{ __html: props.text }}
            ></div>
            <div className="text-green-600 text-sm mr-2">
              (Correct selection)
            </div>
            {props.optionDict[props.oid] ? (
              <div className="text-blue-500 text-sm">(Your selected)</div>
            ) : (
              <div className="text-red-600 text-sm">(Your did not select)</div>
            )}
          </label>
        ) : (
          <label
            htmlFor={props.oid}
            className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-white p-4 drop-shadow-sm hover:border-gray-200 hover:bg-gray-50 peer-checked:border-[--color] peer-checked:ring-1 peer-checked:ring-[--color] peer-checked:bg-blue-10 peer-checked:font-medium"
            style={{
              cursor: hasCorrectOption && "auto",
              "--color": hasCorrectOption ? colors.red[500] : colors.blue[500],
              backgroundColor: hasCorrectOption && colors.white,
            }}
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
                className="h-3.5 w-3.5 text-[--color]"
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
            {hasCorrectOption && props.optionDict[props.oid] && (
              <div className="ml-4 text-blue-600 text-sm">(You selected)</div>
            )}
          </label>
        )}
      </AnimatePresence>
    </div>
  );
}
