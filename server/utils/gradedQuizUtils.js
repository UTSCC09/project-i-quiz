import { transporter, defaultMailOptions } from "./mailTransporter.js";

const sendGradedQuizEmail = async (course, user, quiz, totalScore, maxScore) => {
    if (!course || !quiz) {
      console.log("Fail to provide arguments to send quiz invitations.");
    }

    let gradedQuizOptions = {
    ...defaultMailOptions,
    to: user.email,
    subject: course.courseName + " - " + quiz.quizName + " Grades",
    html: `
        <p>Hi ${user.firstName} ${user.lastName}, </p>
        <p><b>${quiz.quizName}</b> has been marked!</p>
        <p><b>Your grade:</b> ${totalScore} out of ${maxScore}</p>
        <p>© iQuiz 2023. All rights reserved.</p>
    `
    }

    try {
    await transporter.sendMail(gradedQuizOptions);
    } catch (err) { 
    console.log("Fail to send quiz invitation email to: " + user.email);
    }

};

export default sendGradedQuizEmail;