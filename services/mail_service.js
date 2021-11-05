import nodemailer from 'nodemailer';

async function sendEmail({from, to, name, subject, text, html}) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // if true then port:465
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    let info = await transporter.sendMail({
        from: `${name} <${from}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
    });
    // console.log(info);
}
export default sendEmail;