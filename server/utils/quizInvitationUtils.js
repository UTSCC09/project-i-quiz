import { transporter, defaultMailOptions, frontendUrl } from "./mailTransporter.js";

const sendQuizInvitation = async (course, emails, quiz) => {
    if (!course || !quiz) {
      console.log("Fail to provide arguments to send quiz invitations.");
    }
  
    for (const email of emails) {
      let quizInviteOptions = {
        ...defaultMailOptions,
        to: email,
        subject: course.courseName + " " + quiz.quizName + " Notice",
        html: `
          <p><b>Quiz</b>: ${quiz.quizName}</p>
          <p><b>Time</b>: Starts at ${quiz.startTime} and ends at ${quiz.endTime}</p>
          <p><a href=${frontendUrl + "quiz/" + quiz._id}>Click here to start!</p>
        `
      };
      
      try {
        await transporter.sendMail(quizInviteOptions);
      } catch (err) { 
        console.log("Fail to send quiz invitation email to: " + email);
      }
    };
};

export default sendQuizInvitation;