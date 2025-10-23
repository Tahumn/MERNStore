const Mailgun = require('mailgun-js');

const template = require('../config/template');
const keys = require('../config/keys');

const { key, domain, sender } = keys.mailgun || {};

const isConfigured = Boolean(key && domain && sender);

let mailgunClient = null;

if (isConfigured) {
  try {
    mailgunClient = new Mailgun({
      apiKey: key,
      domain
    });
  } catch (error) {
    console.warn('Mailgun configuration is invalid. Email delivery disabled.');
  }
} else {
  console.warn(
    'Mailgun keys are missing. Transactional emails will be skipped until keys are provided.'
  );
}

exports.sendEmail = async (email, type, host, data) => {
  if (!mailgunClient) {
    console.info(
      `Skipped sending "${type}" email to ${email}. Mailgun is not configured.`
    );
    return null;
  }

  try {
    const message = prepareTemplate(type, host, data);

    if (!message) {
      console.warn(`Email template for type "${type}" was not found.`);
      return null;
    }

    const config = {
      from: `MERN Store! <${sender}>`,
      to: email,
      subject: message.subject,
      text: message.text
    };

    return await mailgunClient.messages().send(config);
  } catch (error) {
    console.error(`Failed to send "${type}" email via Mailgun:`, error);
    return error;
  }
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
