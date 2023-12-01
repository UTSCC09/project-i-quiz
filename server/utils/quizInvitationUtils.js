import { transporter, defaultMailOptions, frontendUrl } from "./mailTransporter.js";

const sendQuizInvitation = async (course, emails, quiz) => {
    if (!course || !quiz) {
      console.log("Fail to provide arguments to send quiz invitations.");
    }
  
    for (const email of emails) {
      let quizInviteOptions = {
        ...defaultMailOptions,
        to: email,
        subject: course.courseName + " - " + quiz.quizName + " Notice",
        html: `
          <p>Hello!</p>
          <p><b>${quiz.quizName}</b> will start at ${quiz.startTime.toUTCString()} and ends at ${quiz.endTime.toUTCString()}!</p>
          <p><a href=${frontendUrl + "quiz/" + quiz._id}>Click here to start!</p>
          <p>© iQuiz 2023. All rights reserved.</p>
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