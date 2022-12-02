import nodemailer from 'nodemailer';

export const sendEmail = async (data) => {
    try {
        const contentHTML = data.mail

        let transporter = nodemailer.createTransport({
            host: 'p3plzcpnl475182.prod.phx3.secureserver.net',
            secure: true,
            port: 465,
            auth: {
                user: 'test@suntay.com.mx',
                pass: 'dotdcd123'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"DOTDCD - ERP Support Service" <support.service@dotdcd.com.mx>', // sender address
            to: data.email, // list of receivers
            subject: data.subject, // Subject line
            // text: "Hello world?", // plain text body
            html: contentHTML, // html body
        });

        return nodemailer.getTestMessageUrl(info)

    } catch (error) {
        console.log(error)
    }
}