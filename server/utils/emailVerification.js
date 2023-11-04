import { transporter, mailOptions, backendUrl } from "./mailTransporter.js";

const sendEmailConfirmation = function(user){
    mailOptions.to = user.email;
    mailOptions.subject = "iQuiz Account Verification";
    mailOptions.html = `<p>Verify your iQuiz account below by clicking on the link!</p>
    <p><a href=${backendUrl + "api/users/verify/" + user._id + "/" + user.confirmationCode}>Click here.</p>`;

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("Failed to send confirmation email", error);
    } else {
        console.log("Confirmation email sent to: " + user.email + " successfully!");
    }
    });
}

export default sendEmailConfirmation;
