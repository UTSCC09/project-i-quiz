import { forwardRef, useState, useImperativeHandle } from "react";

function AlertBanner({ message = "" }, ref) {
  const [alertMessage, alertMessageSet] = useState(message);
  const [selfShow, selfShowSet] = useState(false);

  function setMessage(newMessage) {
    alertMessageSet(newMessage);
  }

  function show() {
    selfShowSet(true);
  }

  function hide() {
    selfShowSet(false);
  }

  useImperativeHandle(ref, () => ({
    setMessage,
    show,
    hide,
  }));

  return (
    selfShow && (
      <div className="rounded border-l-4 text-red-700 border-red-500 bg-red-50 p-4 text-sm col-span-6">
        {alertMessage}
      </div>
    )
  );
}

export default forwardRef(AlertBanner);
