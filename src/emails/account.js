const sgMail = require('@sendgrid/mail')
const sendWelcomeMail = (email,name)=>{
    const sendgridAPIKey='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'    
    sgMail.setApiKey(sendgridAPIKey)
    sgMail.send({
        to:email,
        from:'devarunshenoy99@gmail.com',
        subject:'Thanks for joining in !',
        text:`Welcome to the app ,${name}. Let me know how you get along with the app.`
    })
}

const sendCancelMail = (email,name)=>{
    const sendgridAPIKey='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'
    sgMail.setApiKey(sendgridAPIKey)
    sgMail.send({
        from:'devarunshenoy99@gmail.com',
        to:email,
        subject:'Goodbye!',
        text:`We\'re sorry to see you go ${name}. Is there any particular reason? please let us know`
    })
}

module.exports={sendWelcomeMail,sendCancelMail}
