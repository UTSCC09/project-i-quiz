import { transporter, defaultMailOptions } from "./mailTransporter.js";
import PASSWORD_RESET_CONSTANTS from "../constants/passwordResetConstants.js";

const sendPasswordResetCode = async (user) => {
  const mailOptions = {
    ...defaultMailOptions,
    to: user.email,
    subject: "iQuiz Password Reset",
    html: `
      <p>Reset your iQuiz password using the code below:</p>
      <p>${user?.passwordReset?.code}>Click here.</p>
      <p><strong>Warning:</strong> Code will expire in ${PASSWORD_RESET_CONSTANTS.CODE_EXPIRATION}<p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to: " + user.email + " successfully!");
  } catch (error) {
    console.log("Failed to send password reset email", error);
  }
};

export default sendPasswordResetCode;