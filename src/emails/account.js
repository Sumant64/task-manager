const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = process.env.SENDGRID_KEY;

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    console.log(process.env.SENDGRID_KEY)
    sgMail.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}