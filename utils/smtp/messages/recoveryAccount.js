const config = require('../../../config/index');

//TODO VERIFY EMAIL LINK GENERATOR 

function composeActivateMessage(name, email, password) {
  return {
    from: `"🎸 ${config.smtp_sender_name}  " <${config.smtp_user}>`, // sender address
    to: `${email}`, // list of receivers
    subject: `Hi ${name} Recover Your Account for Rokker Music App ✔`, // Subject line
    text: 'Hello world?', // plain text body
    html: `
        <b>Hello ${name} We are sorry that you have lost access to your account, don't worry, we have created a new password, use it in your next login</b>
        <p>Password: ${password}</p>
        <p>Cheers, 🎸  Rockker Support Team</p>
        <a href="${config.app_url_recovery}">Click Here for Login</a>
        <p>¿ Problems ? ? ? Copy and Paste Link: ${config.app_url_recovery}</p>
      `, // html body
  };
}
module.exports = composeActivateMessage;
