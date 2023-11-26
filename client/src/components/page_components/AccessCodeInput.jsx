import { DiceIcon } from "components/elements/SVGIcons";
import SingleLineInput from "components/elements/SingleLineInput";

export default function AccessCodeInput({ inputRef }) {
  return (
    <div className="relative">
      <SingleLineInput ref={inputRef} label="Course access code" />
      <div
        className="absolute z-10 text-slate-500 text-center right-2 top-1/2 p-2.5 -translate-y-1/2 cursor-pointer hover:text-slate-600 hover:bg-gray-100 transition rounded-lg"
        onClick={() => {
          /* [Credit]: Random string generating function from https://stackoverflow.com/a/38622545 */
          inputRef.current.setValue(
            Math.random().toString(36).slice(2, 8).toUpperCase()
          );
        }}
      >
        <DiceIcon className="h-4" />
      </div>
    </div>
  );
}
