import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'josie.wilkinson29@ethereal.email',
        pass: 'DB8M51UygESnGmmU5K'
    }
});

const sendWelcomeEmail = async (userEmail) => {
    const mailOptions = {
        from: 'josie.wilkinson29@ethereal.email',
        to: userEmail,
        subject: 'Welcome to Our App!',
        html: '<h1>Welcome!</h1><p>Thank you for registering with our app.</p>',
    };
    await transporter.sendMail(mailOptions);
};

export {sendWelcomeEmail}