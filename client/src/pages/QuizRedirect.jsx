import { isStudentUserType } from "utils/CookieUtils";
import QuizPage from "./QuizPage";
import QuizEditorPage from "./QuizEditorPage";

export default function QuizRedirect() {
  const isStudent = isStudentUserType();

  return isStudent ? <QuizPage /> : <QuizEditorPage />;
}
