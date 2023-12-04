import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon, CheckIcon } from "./SVGIcons";
import colors from "tailwindcss/colors";

const RadioGroup = (props) => {
  const [selectedOptionId, setSelectedOptionId] = useState(
    props.defaultOptionId
  );

  function onOptionChange(oid) {
    setSelectedOptionId(oid);
    if (props.updateQuestionResponse)
      props.updateQuestionResponse(props.radioGroupId, oid);
  }

  useEffect(() => {
    setSelectedOptionId(props.defaultOptionId);
  }, [props.defaultOptionId]);

  return (
    <div className="flex flex-col gap-3">
      {props.radioOptions.map((choice) => {
        return (
          <RadioOption
            {...props}
            optionText={choice.content}
            optionId={choice.id}
            key={choice.id}
            onOptionChange={onOptionChange}
            selectedOptionId={selectedOptionId}
            correctOptionId={props.correctOptionId}
          />
        );
      })}
    </div>
  );
};

function RadioOption(props) {
  const checkIconVariants = {
    unchecked: { x: "-16px", opacity: 0, transition: { duration: 0.1 } },
    checked: { x: 0, opacity: 1, transition: { duration: 0.2 } },
  };
  const labelTextVariant = {
    unchecked: { x: 0, transition: { duration: 0.1 } },
    checked: { x: "16px", transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence initial={false}>
      <div>
        <input
          type="radio"
          id={`radioGroupId-${props.radioGroupId}-optionId${props.optionId}`}
          name={props.radioGroupId}
          value={props.optionId}
          checked={props.selectedOptionId === props.optionId}
          onChange={() => {
            !props.correctOptionId && props.onOptionChange(props.optionId);
          }}
          className="peer hidden"
        />
        {props.correctOptionId === props.optionId ? (
          <label className="flex items-center rounded-lg border bg-white p-4 shadow-sm  border-green-600 ring-1 ring-green-600 font-medium">
            <CheckIcon className="check-icon h-4 text-green-600 stroke-[4]" />
            <div
              className="ml-4 text-sm sm:text-base pr-4 break-words"
              dangerouslySetInnerHTML={{ __html: props.optionText }}
            ></div>
            {props.correctOptionId === props.selectedOptionId && (
              <div className="text-green-600 text-sm">
                (Your answer is correct)
              </div>
            )}
          </label>
        ) : (
          <label
            htmlFor={`radioGroupId-${props.radioGroupId}-optionId${props.optionId}`}
            className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-white p-4 shadow-sm hover:border-gray-200 hover:bg-gray-50 peer-checked:border-[--color] peer-checked:ring-1 peer-checked:ring-[--color] peer-checked:font-medium peer-checked:bg-blue-10"
            style={{
              cursor: props.correctOptionId && "auto",
              "--color": props.correctOptionId
                ? colors.red[500]
                : colors.blue[500],
              backgroundColor: props.correctOptionId && colors.white,
            }}
          >
            <motion.div
              key="check"
              initial="unchecked"
              animate={
                props.selectedOptionId === props.optionId
                  ? "checked"
                  : "unchecked"
              }
              variants={checkIconVariants}
            >
              <CheckCircleIcon className="check-icon h-5 fill-[--color] drop-shadow-sm" />
            </motion.div>
            <motion.div
              initial="unchecked"
              animate={
                props.selectedOptionId === props.optionId
                  ? "checked"
                  : "unchecked"
              }
              variants={labelTextVariant}
              className="-ml-2 text-sm sm:text-base pr-4 break-words"
              dangerouslySetInnerHTML={{ __html: props.optionText }}
            ></motion.div>
            {props.correctOptionId &&
              props.selectedOptionId === props.optionId && (
                <div className="ml-4 text-blue-600 text-sm">
                  (You selected)
                </div>
              )}
          </label>
        )}
      </div>
    </AnimatePresence>
  );
}

export default RadioGroup;
