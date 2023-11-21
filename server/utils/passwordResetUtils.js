import { transporter, defaultMailOptions } from "./mailTransporter.js";
import PASSWORD_RESET_CONSTANTS from "../constants/passwordResetConstants.js";

const sendPasswordResetCode = async (user, code) => {
  let expireTimeLengthStr;
  if (PASSWORD_RESET_CONSTANTS.CODE_EXPIRATION / 1000 < 60) {
    expireTimeLengthStr = `${
      PASSWORD_RESET_CONSTANTS.CODE_EXPIRATION / 1000
    } seconds`;
  } else if (PASSWORD_RESET_CONSTANTS.CODE_EXPIRATION / 1000 == 60) {
    expireTimeLengthStr = "1 minute";
  } else {
    expireTimeLengthStr = `${
      PASSWORD_RESET_CONSTANTS.CODE_EXPIRATION / 1000 / 60
    } minutes`;
  }

  const mailOptions = {
    ...defaultMailOptions,
    to: user.email,
    subject: "iQuiz Password Reset",
    html: `
      <p>Reset your iQuiz password using the code below:</p>
      <h1>${code}</h1>
      <p>The code will <strong>expire in ${expireTimeLengthStr}</strong>.<p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      "Password reset email sent to: " + user.email + " successfully!"
    );
  } catch (error) {
    console.log("Failed to send password reset email", error);
  }
};

export default sendPasswordResetCode;
