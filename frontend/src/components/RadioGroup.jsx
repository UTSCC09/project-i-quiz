import React from "react";

const RadioGroup = (props) => {
  const RadioOption = (props) => {
    const onOptionChangeHandler = props.onOptionChangeHandler;
    return (
    <div className="flex items-center">
      <div className="bg-white dark:bg-gray-100 rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative">
          <input
            type="radio"
            id={`radio-qid${props.radioGroupId}-oid${props.optionId}`}
            name={props.radioGroupId}
            value={props.choiceContent}
            checked={props.selectedOptionId == props.optionId}
            onChange={ () => { onOptionChangeHandler(props.optionId) } }
            className="checkbox appearance-none focus:outline-none border rounded-full border-gray-400 absolute cursor-pointer w-full h-full checked:border-none transition-all duration-500"
          />
          <div
          className="check-icon hidden border-4 border-iquiz-blue rounded-full w-full h-full z-1"></div>
      </div>
      <span
          id={`radioLabel-qid${props.radioGroupId}-oid${props.optionId}`} 
          dangerouslySetInnerHTML={ { __html: props.choiceContent } } className="ml-2 leading-4 font-normal text-gray-800 dark:text-gray-100"></span>
      <style>
        {`
          .checkbox:checked { border: none; }
          .checkbox:checked + .check-icon { display: flex; }
        `}
      </style>
    </div>
    )
  }
  return (
  <form className="flex flex-col gap-8">
  {
    props.radioOptions.map((option) =>
      {
        return (
        <RadioOption 
          radioGroupId={props.radioGroupId}
          choiceContent={option.content} 
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