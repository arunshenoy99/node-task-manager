const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeMail = (email,name)=>{   
    sgMail.send({
        to:email,
        from:'devarunshenoy99@gmail.com',
        subject:'Thanks for joining in !',
        text:`Welcome to the app ,${name}. Let me know how you get along with the app.`
    })
}

const sendCancelMail = (email,name)=>{
    sgMail.send({
        from:'devarunshenoy99@gmail.com',
        to:email,
        subject:'Goodbye!',
        text:`We\'re sorry to see you go ${name}. Is there any particular reason? please let us know`
    })
}

module.exports={sendWelcomeMail,sendCancelMail}
