exports.resetEmail = (origin, resetToken) => {
  const message = {
    subject: 'Reset Password',
    text:
      `${
        'You are receiving this because you have requested to reset your password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        ''
      }${origin}/reset-password/${resetToken}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  return message;
};

exports.confirmResetPasswordEmail = () => {
  const message = {
    subject: 'Password Changed',
    text:
      `You are receiving this email because you changed your password. \n\n` +
      `If you did not request this change, please contact us immediately.`
  };

  return message;
};

exports.merchantSignup = (origin, { resetToken, email }) => {
  const encodedEmail = encodeURIComponent(email);
  const link = `${origin}/merchant/signup/${resetToken}?email=${encodedEmail}`;

  const text = [
    'Welcome to Become a Supplier',
    'Click the link to create a password',
    link
  ].join('\n');

  const message = {
    subject: 'Merchant Signup',
    text,
    html: `<p>Welcome to Become a Supplier</p><p>Click the link to create a password</p><p><a href="${link}">${link}</a></p>`
  };

  return message;
};

exports.merchantWelcome = name => {
  const message = {
    subject: 'Merchant Registration',
    text:
      `Hi ${name}! Congratulations! Your application for merchant account has been accepted. \n\n` +
      `It looks like you already have a member account with us. Please sign in with your member credentials and you will be able to see your merchant account.`
  };

  return message;
};

exports.signupEmail = name => {
  const message = {
    subject: 'Account Registration',
    text: `Hi ${name.firstName} ${name.lastName}! Thank you for creating an account with us!.`
  };

  return message;
};

exports.newsletterSubscriptionEmail = () => {
  const message = {
    subject: 'Newsletter Subscription',
    text:
      `You are receiving this email because you subscribed to our newsletter. \n\n` +
      `If you did not request this change, please contact us immediately.`
  };

  return message;
};

exports.contactEmail = () => {
  const message = {
    subject: 'Contact Us',
    text: `We received your message! Our team will contact you soon. \n\n`
  };

  return message;
};

exports.merchantApplicationEmail = () => {
  const message = {
    subject: 'Sell on MERN Store',
    text: `We received your request! Our team will contact you soon. \n\n`
  };

  return message;
};

exports.merchantDeactivateAccount = () => {
  const message = {
    subject: 'Merchant account on MERN Store',
    text:
      `Your merchant account has been disabled. \n\n` +
      `Please contact admin to request access again.`
  };

  return message;
};

exports.orderConfirmationEmail = order => {
  const firstName =
    order?.user?.profile?.firstName || order?.user?.profile?.lastName
      ? `${order?.user?.profile?.firstName ?? ''} ${
          order?.user?.profile?.lastName ?? ''
        }`.trim()
      : order?.user?.email || 'there';

  const shipping = order?.shipping;
  const paymentMethod = order?.payment?.method;

  let shippingMessage = '';

  if (shipping) {
    const lines = [
      shipping.fullName,
      shipping.address,
      `${shipping.city ?? ''}${shipping.city && shipping.state ? ', ' : ''}${
        shipping.state ?? ''
      }`,
      shipping.country,
      shipping.zipCode ? `Zip: ${shipping.zipCode}` : null,
      shipping.phoneNumber ? `Phone: ${shipping.phoneNumber}` : null
    ].filter(Boolean);

    shippingMessage =
      `Shipping details:\n${lines.join('\n')}\n\n` +
      (paymentMethod ? `Payment method: ${paymentMethod}\n\n` : '');
  } else if (paymentMethod) {
    shippingMessage = `Payment method: ${paymentMethod}\n\n`;
  }

  const message = {
    subject: `Order Confirmation ${order._id}`,
    text:
      `Hi ${firstName}! Thank you for your order!. \n\n` +
      `We've received your order and will contact you as soon as your package is shipped. \n\n` +
      shippingMessage
  };

  return message;
};
