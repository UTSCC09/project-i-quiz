import { jsPDF } from "jspdf";

//Generates PDF with student answers and their grade
function generateStudentPDF(course, quiz, questions, user, quizResponse) {
  if (!course || !quiz || !questions || !user || !quizResponse) {
    return;
  }
  const pdf = new jsPDF();

  // Title
  pdf.setFontSize(18);
  pdf
    .setFont(undefined, "bold")
    .text(`${course.courseName} - ${quiz.quizName}`, 20, 15)
    .setFont(undefined, "normal");

  // Student details
  pdf.setFontSize(14);
  pdf
    .setFont(undefined, "bold")
    .text(`Student: ${user.firstName} ${user.lastName}`, 20, 30)
    .setFont(undefined, "normal");

  // Date
  pdf.setFontSize(12);
  const start = new Date(quiz.startTime);
  const end = new Date(quiz.endTime);
  pdf.text(`Start Date: ${start.toUTCString()}`, 20, 40);
  pdf.text(`End Date: ${end.toUTCString()}`, 20, 50);

  // Setting Y-Position
  let yPos = 65;

  // Question index
  let index = 0;

  let finalScore = 0;
  let totalScore = 0;

  // Questions
  for (const questionResponse of quizResponse.questionResponses) {
    const question = questions.filter(
      (q) => q._id.toString() === questionResponse.question.toString()
    )[0];
    if (question) {
      const response = questionResponse.response
        ? questionResponse.response.join(", ")
        : "N/A";
      const score = questionResponse.score ? questionResponse.score : 0;
      const maxScore = question.maxScore ? question.maxScore : 0;

      pdf.setFontSize(12);
      pdf
        .setFont(undefined, "bold")
        .text(
          `Question ${index + 1}: ${
            question.prompt ? question.prompt : "N/A"
          }`,
          20,
          yPos
        )
        .setFont(undefined, "normal");
      pdf.setFontSize(11);

      if (question.type === "MSQ" || question.type === "MCQ") {
        let answers = [];

        for (const r of questionResponse.response) {
          answers.push(
            question.choices[parseInt(r)]
              ? question.choices[parseInt(r)].content
              : "N/A"
          );
        }

        pdf.text(`You selected: ${answers}`, 20, yPos + 15);
      } else {
        pdf.text(`You answered: ${response}`, 20, yPos + 15);
      }
      pdf.text(`You scored: ${score}`, 20, yPos + 25);

      yPos += 40;
      index += 1;
      finalScore += score;
      totalScore += maxScore;
    }
  }

  // Final Score
  yPos += 5;
  pdf.setFontSize(14);
  pdf
    .setFont(undefined, "bold")
    .text(`Final Score: ${finalScore}/${totalScore}`, 20, yPos);

  return pdf;
}

//Generates PDF for instructors usage inperson
function generateInstructorPDF(course, quiz, questions) {
  if (!course || !quiz || !questions) {
    return;
  }
  const pdf = new jsPDF();

  // Title
  pdf.setFontSize(18);
  pdf
    .setFont(undefined, "bold")
    .text(`${course.courseName} - ${quiz.quizName}`, 20, 15)
    .setFont(undefined, "normal");

  // Student Name
  pdf.setFontSize(14);
  pdf.setFont(undefined, "bold")
    .text(`Name: _________________`, 20, 25);

  // Date
  pdf.text(`Date:   _________________`, 20, 32)
    .setFont(undefined, "normal");

  // Setting Y-Position
  let yPos = 45;

  // Question index
  let index = 0;

  // Questions
  for (const question of questions) {
    pdf.setFontSize(14);
    pdf.setFont(undefined, "bold")
      .text(`Question ${index + 1}`, 20, yPos)
      .setFont(undefined, "normal");
    yPos += 7;

    for (const s of question.prompt.split('\n')) {
      pdf.text(`${s}`, 20, yPos)
      yPos += 6;
    }

    pdf.setFontSize(12);
    if (question.type === "MSQ" || question.type === "MCQ") {
      let optionNum = 1;
      for (const c of question.choices) {
        pdf.text(`${optionNum}:  ${c.content}`, 25, yPos);
        yPos += 5;
        optionNum += 1;
      }
      yPos += 10;
    } else {
      yPos += 50;
    }


    index += 1;
  
  }
  return pdf;
}

export { generateStudentPDF, generateInstructorPDF };
