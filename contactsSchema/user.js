const Joi = require("joi");

const resendVerificationValidationSchema = Joi.object({
    email: Joi.string().email().required(),
});

module.exports = { resendVerificationValidationSchema };

// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendMail = (email, verificationToken) => {
//     const msg = {
//         to: email,
//         from: "grynbest@gmail.com", // Use the email address or domain you verified above
//         subject: "Thank you for the registration",
//         text: `Please, confirm your email address http://localhost:3000/users/verify/${verificationToken}`,
//         html: `Please, <a href="http://localhost:3000/users/verify/${verificationToken}">confirm</a> your email address`,
//     };
//     (async () => {
//         try {
//             await sgMail.send(msg);
//             console.log("email has been sent");
//         } catch (error) {
//             console.error(error);

//             if (error.response) {
//                 console.error(error.response.body);
//             }
//         }
//     })();
// };

// module.exports = { sendMail };

// const verificationController = async (req, res) => {
//     const { verificationToken } = req.params;
//     await verifyUser(verificationToken);
//     res.status(200).json({ status: "Verification successful" });
// };

// const resendVerificationController = async (req, res) => {
//     await resendVerification(req.body.email);
//     res.json({ message: "Verification email sent" });
// };