const Mailchimp = require('mailchimp-api-v3');

const keys = require('../config/keys');

const { key, listKey } = keys.mailchimp || {};

let mailchimpClient = null;

if (key && listKey) {
  try {
    mailchimpClient = new Mailchimp(key);
  } catch (error) {
    console.warn(
      'Mailchimp configuration is invalid. Newsletter subscriptions will be skipped.'
    );
  }
} else {
  console.warn(
    'Mailchimp keys are missing. Newsletter subscriptions will be skipped until keys are provided.'
  );
}

exports.subscribeToNewsletter = async email => {
  if (!mailchimpClient) {
    console.info(
      `Skipped subscribing ${email} to the newsletter because Mailchimp is not configured.`
    );
    return null;
  }

  try {
    return await mailchimpClient.post(`lists/${listKey}/members`, {
      email_address: email,
      status: 'subscribed'
    });
  } catch (error) {
    console.error('Failed subscribing to Mailchimp list:', error);
    return error;
  }
};
