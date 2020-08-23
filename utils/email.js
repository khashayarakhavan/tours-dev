/* eslint-disable */
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const mailGun = require('nodemailer-mailgun-transport');
const keys = require('../config/keys');

const authProd = {
  auth: {
    api_key: keys.sendMailGunKey,
    domain: keys.sendMailGunDomain
  }
};

const authDev = {
  auth: {
    api_key: keys.sendMailGunKey,
    domain: keys.sendMailGunDomain
  }
};

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `AftoflBig5 <${process.env.EMAIL_FROM}>`;
  }
  
// :DEV change dev => prod

  newTransport() { // Define the SMTP transporter -->
    // MailGun
    if (process.env.NODE_ENV === 'production') {
      console.log('📧 Email is in production');
      return nodemailer.createTransport(mailGun(authProd));
    } else if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email is in development');
      return nodemailer.createTransport(mailGun(authDev));
    } else {
      console.log(
        '📧 Email is using the personal transporter such as Gmail,Hotmail,etc.'
      );
      return nodemailer.createTransport({
        host: keys.mailTrapHost,
        port: keys.mailTrapPort,
        auth: {
          user: keys.mailTrapUsername,
          pass: keys.mailTrapPassword
        }
      });
    }
  } // <-- SMTP Transporter
    
  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send emails
    await this.newTransport().sendMail(mailOptions, function(err, data) { // CallBack function for sending email
        if (err) { 
          console.log('the error is : ', err); // Log if there is any error
          
        } else {
          console.log('Email sent with Nodemailer via MailTrap Service', data); // log the response from mail service to show the result of sent emails.
          
        }
      });
  }

  async sendWelcome() 
   {
    await this.send('welcome', 'Welcome to the Natours Family!');
    console.log("EMAIL SENT :D ");
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
