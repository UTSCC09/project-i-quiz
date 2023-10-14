import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion"

const RadioGroup = (props) => {
  const [selectedOptionId, setSelectedOptionId] = useState(props.defaultOptionId);

  function onOptionChange(oid) {
    setSelectedOptionId(oid);
    props.autoSaveAnswers();
  }

  return (
    <div className="flex flex-col gap-3">
      {
        props.radioOptions.map((option) => {
          return (
            <RadioOption
              {...props}
              optionText={option.content}
              optionId={option.id}
              key={option.id}
              onOptionChange={onOptionChange}
              selectedOptionId={selectedOptionId}
            />);
        })
      }
    </div>
  );
}

function RadioOption(props) {
  const checkIconVariants = {
    unchecked: {
      x: "-16px", opacity: 0, transition: { duration: 0.1, delay: 0.1 }
    },
    checked: { x: 0, opacity: 1, transition: { duration: 0.2 } },
  };
  const labelTextVariant = {
    unchecked: { x: "-16px", transition: { duration: 0.1 } },
    checked: { x: 0, transition: { duration: 0.2 } }
  };

  return (
    <div>
      <input
        type="radio"
        id={`radioGroupId-${props.radioGroupId}-optionId${props.optionId}`}
        name={props.radioGroupId}
        value={props.optionId}
        checked={props.selectedOptionId === props.optionId}
        onChange={() => { props.onOptionChange(props.optionId); }}
        className="peer hidden"
      />
      <label
        htmlFor={`radioGroupId-${props.radioGroupId}-optionId${props.optionId}`}
        className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-white p-4 drop-shadow-sm hover:border-gray-200 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500 peer-checked:font-medium peer-checked:bg-blue-10"
      >
        <motion.div
          initial="unchecked"
          animate={props.selectedOptionId === props.optionId ? "checked" : "unchecked"}
          variants={checkIconVariants}
        >
          <CheckCircleIcon className="check-icon h-5 fill-iquiz-blue drop-shadow-sm" />
        </motion.div>
        <motion.div
          initial="unchecked"
          animate={props.selectedOptionId === props.optionId ? "checked" : "unchecked"}
          variants={labelTextVariant}
          className="ml-2 sm:ml-3 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: props.optionText }}>
        </motion.div>
      </label>
    </div>
  )
}

export default RadioGroup;