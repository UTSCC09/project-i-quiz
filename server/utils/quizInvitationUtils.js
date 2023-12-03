import User from "../models/User.js";
import {
  transporter,
  defaultMailOptions,
  frontendUrl,
} from "./mailTransporter.js";

const sendQuizInvitation = async (course, emails, quiz) => {
  if (!course || !quiz) {
    console.error("Fail to provide arguments to send quiz invitations.");
  }

  for (const email of emails) {
    const student = await User.findOne({ email: email });
    if (!student) {
      console.error("Cannot find user with email: " + email);
      continue;
    }
    let quizInviteOptions = {
      ...defaultMailOptions,
      to: email,
      subject: `[${course.courseCode} ${course.courseSemester}] ${quiz.quizName} Release Notice`,
      html: `
          <p>Hi ${student.firstName},</p>
          <p>A new quiz has just been released!</p>
          <p>Quiz Name: <b>${quiz.quizName}</b></p>
          <p>Course: <b>${course.courseCode} ${course.courseSemester}</b> - ${
        course.courseName
      }</p>
          <p>The quiz will start on <b>${quiz.startTime.toUTCString()}</b> and end on <b>${quiz.endTime.toUTCString()}</b>.</p>
          <p>Be prepared and good luck!</p>
          <p><a href=${
            frontendUrl + "quiz/" + quiz._id
          }>Click here to view the quiz!</p>
          <p>Best,</p>
          <p>iQuiz Team</p>
          <p>© iQuiz 2023. All rights reserved.</p>
        `,
    };

    try {
      await transporter.sendMail(quizInviteOptions);
    } catch (err) {
      console.error("Fail to send quiz invitation email to: " + email);
    }
  }
};

export default sendQuizInvitation;
