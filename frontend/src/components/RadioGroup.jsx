import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion"

const RadioGroup = (props) => {
  const RadioOption = (props) => {
    const onOptionChange = props.onOptionChange;
    return (
    <div>
      <input
        type="radio"
        id={`radioGroupId-${props.radioGroupId}-optionId${props.optionId}`}
        name={props.radioGroupId}
        value={props.optionId}
        checked={props.selectedOptionId === props.optionId}
        onChange={ () => { onOptionChange(props.optionId) } }
        // apply effect to ">label>.check-icon" and ">label>span" when checked
        className="peer hidden [&:checked_+_label_span]:font-medium"
      />
      <label
        htmlFor={`radioGroupId-${props.radioGroupId}-optionId${props.optionId}`}
          className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-white p-4 drop-shadow-sm hover:border-gray-200 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500"
      >
        <AnimatePresence>
          { props.selectedOptionId === props.optionId && 
          <motion.div 
            initial={{ x: "-20%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <CheckCircleIcon className="check-icon h-5 fill-iquiz-blue drop-shadow-sm" />
          </motion.div>
          }
        </AnimatePresence>
        <span className="ml-2 sm:ml-3 text-sm sm:text-base" dangerouslySetInnerHTML={ { __html: props.optionText } }></span>
      </label>
    </div>
    )
  }
  return (
  <div className="flex flex-col gap-3">
  {
    props.radioOptions.map((option) =>
      {
        return (
        <RadioOption 
          radioGroupId={props.radioGroupId}
          optionText={option.content} 
          optionId={option.id} 
          selectedOptionId={props.selectedOptionId} 
          onOptionChange={props.onOptionChange} 
          key={option.id}
      />);
    })
  }
  </div>
  );
}

export default RadioGroup;