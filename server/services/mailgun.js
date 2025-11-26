const Mailgun = require('mailgun-js');
const nodemailer = require('nodemailer');

const template = require('../config/template');
const keys = require('../config/keys');

const { key, domain, sender, host: mailgunHost } = keys.mailgun || {};
const smtpConfig = keys.smtp || {};
const appName = keys.app?.name ?? 'MERN Store';
const defaultClientUrl = keys.app?.clientURL ?? '';

const smtpOptions = {
  host: smtpConfig.host || process.env.SMTP_HOST,
  port: smtpConfig.port,
  user: smtpConfig.user || process.env.SMTP_USER,
  pass: smtpConfig.pass || process.env.SMTP_PASS,
  sender: smtpConfig.sender || smtpConfig.user || process.env.SMTP_EMAIL_SENDER,
  secure: typeof smtpConfig.secure === 'boolean' ? smtpConfig.secure : false
};

let smtpTransport = null;
const hasSmtpRequirements =
  smtpOptions.host && smtpOptions.user && smtpOptions.pass && smtpOptions.sender;

if (hasSmtpRequirements) {
  try {
    smtpTransport = nodemailer.createTransport({
      host: smtpOptions.host,
      port: smtpOptions.port || 587,
      secure: smtpOptions.secure || (smtpOptions.port || 587) === 465,
      auth: {
        user: smtpOptions.user,
        pass: smtpOptions.pass
      }
    });
  } catch (error) {
    console.error('Failed to configure SMTP transport:', error);
  }
} else {
  console.warn(
    'SMTP settings are missing. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS to enable email delivery without Mailgun.'
  );
}

const hasMailgunConfig = Boolean(key && domain && sender);
let mailgunClient = null;

if (hasMailgunConfig) {
  try {
    const mailgunOptions = {
      apiKey: key,
      domain
    };

    if (mailgunHost) {
      mailgunOptions.host = mailgunHost;
    }

    mailgunClient = new Mailgun(mailgunOptions);
  } catch (error) {
    console.warn('Mailgun configuration is invalid. SMTP will be used instead.');
  }
} else {
  console.warn('Mailgun keys are missing. Using SMTP transport.');
}

const sendWithMailgun = async (email, message, type) => {
  if (!mailgunClient) return null;

  const config = {
    from: `${appName} <${sender}>`,
    to: email,
    subject: message.subject,
    text: message.text
  };

  if (message.html) {
    config.html = message.html;
  }

  try {
    return await mailgunClient.messages().send(config);
  } catch (error) {
    const status = error?.statusCode;
    if (status === 401 || status === 403) {
      console.error(
        `Failed to send "${type}" email via Mailgun (auth/permissions). Check MAILGUN_KEY/MAILGUN_DOMAIN/MAILGUN_HOST and sender ${sender}.`,
        error
      );
    } else {
      console.error(`Failed to send "${type}" email via Mailgun:`, error);
    }
    return null;
  }
};

const sendWithSmtp = async (email, message, type) => {
  if (!smtpTransport) return null;

  try {
    return await smtpTransport.sendMail({
      from: `${appName} <${smtpOptions.sender}>`,
      to: email,
      subject: message.subject,
      text: message.text,
      html: message.html
    });
  } catch (error) {
    console.error(`Failed to send "${type}" email via SMTP:`, error);
    return null;
  }
};

exports.sendEmail = async (email, type, host, data) => {
  const resolvedHost = (host || defaultClientUrl).replace(/\/+$/, '');
  const message = prepareTemplate(type, resolvedHost, data);

  if (!message) {
    console.warn(`Email template for type "${type}" was not found.`);
    return null;
  }

  const smtpResult = await sendWithSmtp(email, message, type);

  if (smtpResult) {
    return smtpResult;
  }

  const mailgunResult = await sendWithMailgun(email, message, type);

  if (mailgunResult) {
    return mailgunResult;
  }

  console.warn(
    `Unable to send "${type}" email to ${email}. Configure SMTP or Mailgun settings to enable email delivery.`
  );
  return null;
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'reset':
      message = template.resetEmail(host, data);
      break;

    case 'reset-confirmation':
      message = template.confirmResetPasswordEmail();
      break;

    case 'signup':
      message = template.signupEmail(data);
      break;

    case 'merchant-signup':
      message = template.merchantSignup(host, data);
      break;

    case 'merchant-welcome':
      message = template.merchantWelcome(data);
      break;

    case 'newsletter-subscription':
      message = template.newsletterSubscriptionEmail();
      break;

    case 'contact':
      message = template.contactEmail();
      break;

    case 'merchant-application':
      message = template.merchantApplicationEmail();
      break;

    case 'merchant-deactivate-account':
      message = template.merchantDeactivateAccount();
      break;

    case 'order-confirmation':
      message = template.orderConfirmationEmail(data);
      break;

    default:
      message = '';
  }

  return message;
};
