const config = require('../../../config/index');

//TODO VERIFY EMAIL LINK GENERATOR 

function composeActivateMessage(name, email, id) {
  return {
    from: `"🎸 ${config.smtp_sender_name}  " <${config.smtp_user}>`, // sender address
    to: `${email}`, // list of receivers
    subject: `Hi ${name} Welcome to Rokker Music App, Please Activate your Account ✔`, // Subject line
    text: 'Hello world?', // plain text body
    html: `
        <b>Hello ${name} Welcome to Rokker Music App, Please Activate your Account with Link</b>
        <p>Cheers, 🎸  Rockker Support Team</p>
        <a href="${config.app_url_activate}?id=${id}">Activate Account LINK: ${config.app_url_activate}</a>
      `, // html body
  };
}
module.exports = composeActivateMessage;