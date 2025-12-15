const nodemailer = require("nodemailer");

const sendEmail = async(to ,subject ,message)=> {
    try{
        const transporter = nodemailer.createTransport({
            host:"smtp-relay.brevo.com",
            port:587,

            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from:process.env.SENDER_EMAIL,
            to:to,
            subject:subject,
            text:message

        });

        console.log("message sent :" ,info.messageId);
    }catch(err){
        console.log(err);
        throw new Error("Email sending failed");
    }
}

module.exports=sendEmail;
