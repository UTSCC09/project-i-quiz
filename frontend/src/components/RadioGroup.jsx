import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion"

const RadioGroup = (props) => {
  const RadioOption = (props) => {
    const onOptionChangeHandler = props.onOptionChangeHandler;
    return (
    <div>
      <input
        type="radio"
        id={`radio-qid${props.radioGroupId}-oid${props.optionId}`}
        name={props.radioGroupId}
        value={props.optionText}
        checked={props.selectedOptionId == props.optionId}
        onChange={ () => { onOptionChangeHandler(props.optionId) } }
        // apply effect to ">label>.check-icon" and ">label>span" when checked
        className="peer hidden [&:checked_+_label_span]:font-medium"
      />
      <label
        htmlFor={`radio-qid${props.radioGroupId}-oid${props.optionId}`}
          id={`radioLabel-qid${props.radioGroupId}-oid${props.optionId}`} 
          className="flex cursor-pointer items-center rounded-lg border border-gray-100 bg-white p-4 drop-shadow-sm hover:border-gray-200 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500"
      >
        <AnimatePresence>
          { props.selectedOptionId == props.optionId && 
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
  <form className="flex flex-col gap-3">
  {
    props.radioOptions.map((option) =>
      {
        return (
        <RadioOption 
          radioGroupId={props.radioGroupId}
          optionText={option.content} 
          optionId={option.id} 
          selectedOptionId={props.selectedOptionId} 
          onOptionChangeHandler={props.onOptionChangeHandler} 
          key={option.id}
      />);
    })
  }
  </form>
  );
}

export default RadioGroup;