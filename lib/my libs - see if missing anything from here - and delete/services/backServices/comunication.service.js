

const config = require('../config');

const { delay } = require("./utils.service");

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGrid.apiKey);

async function sendEmail({ to, from, subject, html, fromEmail, fromName, allowReply = false }) {
  const noReplayMegaponEmail = 'noreply@megaphon.co.il'; // 'noreply@patiphon.co.il'
  const actualFromEmail = allowReply? fromEmail || noReplayMegaponEmail : noReplayMegaponEmail;
  const actualFromName = fromName || 'Megaphone';
  from = from || `${actualFromName} <${actualFromEmail}>`;
  const msg = {
    from,
    to,
    subject,
    html,
    // trackingSettings: { openTracking: { enable: true } }
  };
  if (!config.allowDistribution) {
    await delay(1000);
    return Promise.reject('Not allowd to distribute in env');
    // return Math.random() > 0.5? Promise.resolve() : Promise.reject('Custom error');
  } else {
    return sgMail.send(msg);
    // emailService.sendEmail({ subject, to, html, fromEmail, fromName, allowReply })
  }
  // return sgMail.send(msg);
}


// TODO:
// make sure not to include sendgrid errored contacts in success.
// check if can unBounced some sendgrid contacts::
//     This email was not sent because the email address previously bounced.

// If you believe they should receive this type of email in the future, remove them from the Bounces suppression group. Learn more.
// look at: https://chatgpt.com/share/ff192cf1-7740-4385-be5a-b91d243f5ef4



const { Twilio } = require('twilio');
const smsClient = new Twilio(config.twilio.accountSid, config.twilio.authToken);
async function sendSMS({ to, body }) {
  const msg = {
    from: config.twilio.phoneNumber,
    to,
    body
  };
  console.log('SENDING SMS', msg);
  if (!config.allowDistribution) {
    await delay(1000);
    return Promise.reject('Not allowd to distribute in env');
    return Math.random() > 0.5? Promise.resolve() : Promise.reject('Custom error');
  } else {
    return smsClient.messages.create(msg);
  }
}

module.exports = {
  sendEmail,
  sendSMS
}