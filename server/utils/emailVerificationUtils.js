import { transporter, defaultMailOptions, backendUrl } from "./mailTransporter.js";
  
const sendEmailVerificationLink = async (user) => {
  const mailOptions = {
    ...defaultMailOptions,
    to: user.email,
    subject: "iQuiz Account Verification",
    html: `
      <p>Verify your iQuiz account below by clicking on the link!</p>
      <p><a href=${backendUrl + "api/users/verifyemail/" + user._id + "/" + user.emailVerificationCode}>Click here.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to: " + user.email + " successfully!");
  } catch (error) {
    console.log("Failed to send verification email", error);
  }
};

export default sendEmailVerificationLink;
