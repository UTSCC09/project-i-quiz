import { jsPDF } from "jspdf";

function generatePDF(course, quiz, questions, user, quizResponse) {
    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(18);
    pdf.setFont(undefined, "bold")
    .text(`${course.courseName} - ${quiz.quizName}`, 20, 15)
    .setFont(undefined, "normal");

    // Student details
    pdf.setFontSize(14);
    pdf.setFont(undefined, "bold")
    .text(`Student: ${user.firstName} ${user.lastName}`, 20, 30)
    .setFont(undefined, "normal");

    // Date
    pdf.setFontSize(12);
    pdf.text(`Start Date: ${quiz.startTime.toUTCString()}`, 20, 40);
    pdf.text(`End Date: ${quiz.endTime.toUTCString()}`, 20, 50);

    // Setting Y-Position
    let yPos = 65;
    
    // Question index
    let index = 0;

    let finalScore = 0;
    let totalScore = 0;

    // Questions
    for (const questionResponse of quizResponse.questionResponses) {
        const question = questions.filter((q) => q._id.toString() === questionResponse.question.toString())[0];
        if (question) { 
            const response = questionResponse.response ? questionResponse.response.join(', ') : "N/A";
            const score = questionResponse.score ? questionResponse.score : 0;
            const maxScore = question.maxScore ? question.maxScore : 0;
            
            pdf.setFontSize(12);
            pdf.setFont(undefined, "bold")
            .text(`Question ${index + 1}: ${question.prompt ? question.prompt : "N/A"}`, 20, yPos)
            .setFont(undefined, "normal");
            pdf.setFontSize(11);

            if (question.type == 'MSQ' || question.type == 'MCQ') {
                let answers = [];

                for (const r of questionResponse.response) {
                    answers.push(question.choices[parseInt(r)] 
                    ? question.choices[parseInt(r)].content : "N/A");
                }

                pdf.text(`You selected: ${answers}`, 20, yPos + 15);

            } 
            else {
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
    pdf.setFont(undefined, "bold")
    .text(`Final Score: ${finalScore}/${totalScore}`, 20, yPos);

    return pdf;
}

export default generatePDF;
