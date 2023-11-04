import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false, 
    port: 587, 
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS
    }
});

const sendEmailConfirmation = function(user){
    let backendUrl = "http://localhost:" + process.env.PORT + "/";
    let mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: user.email,
        subject: 'iQuiz Email Verification',
        html: `<p>Verify your iQuiz account below by clicking on the link!</p>
        <p><a href=${backendUrl + "api/users/verify/" + user._id + "/" + user.confirmationCode}>Click here.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("Failed to send confirmation email", error);
    } else {
        console.log("Confirmation email sent to: " + user.email + " successfully!");
    }
    });
}

export default sendEmailConfirmation;
