const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user:'rajputroshini684@gmail.com', // generated ethereal user
    pass: 'xeyrbdbdwbcgclcw', // generated ethereal password
  },
});

function sendMail(email,token,callback){

  let info={
    from:'rajputroshini684@gmail.com',
    to:email,
    subject:"ApnaBazaar - Email Verification",
    text:"verify your email",
    html:`<a href='http://localhost:3000/verifymail/${token}'>click here... </a>`,
  }

  transporter.sendMail(info,callback);
}

function pswdChangedMail(email,callback){

  let info={
    from:'rajputroshini684@gmail.com',
    to:email,
    subject:"ApnaBazaar - Change Password",
    text:"Your password has changed successfully",
  }

  transporter.sendMail(info,callback);
}

function pswdForgotMail(email,callback){

  let info={
    from:'rajputroshini684@gmail.com',
    to:email,
    subject:"ApnaBazaar - Forgot Password",
    text:"Click the link to change your password",
    html:`<a href='http://localhost:3000/forgetmail/${email}'>click here... </a>`,
  }

  transporter.sendMail(info,callback);
}


module.exports={sendMail,pswdChangedMail,pswdForgotMail}