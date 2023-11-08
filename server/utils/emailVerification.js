import { transporter, defaultMailOptions, backendUrl } from "./mailTransporter.js";

const sendEmailVerification = function(user){
  const mailOptions = {
    ...defaultMailOptions,
    to: user.email,
    subject: "iQuiz Account Verification",
    html: `
      <p>Verify your iQuiz account below by clicking on the link!</p>
      <p><a href=${backendUrl + "api/users/verify/" + user._id + "/" + user.emailVerificationCode}>Click here.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Failed to send verification email", error);
    } else {
      console.log("Verification email sent to: " + user.email + " successfully!");
    }
  });
}

export default sendEmailVerification;
