import NavBar from "components/page_components/NavBar";
import MCQEditor from "components/quiz_editor/MCQEditor";

export default function QuizEditorPage() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen w-full bg-gray-100 -z-50 flex flex-col items-center">
        <div className="px-8 md:px-24 w-full lg:w-[64rem] py-36 flex flex-col gap-6">
          <div className="w-full bg-white h-fit py-16 px-16 rounded shadow-sm">
            <MCQEditor />
          </div>
        </div>
      </div>
    </>
  );
}
