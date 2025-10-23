/**
 *
 * Checkout
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import { ROLES } from '../../constants';

import Input from '../../components/Common/Input';
import SelectOption from '../../components/Common/SelectOption';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import CartSummary from '../../components/Store/CartSummary';

const PAYMENT_OPTIONS = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'EWALLET', label: 'E-Wallet / QR Payment' },
  { value: 'CARD', label: 'Credit / Debit Card (Offline)' }
];

const sanitizeValue = value =>
  typeof value === 'string' ? value.trim() : value ?? '';

class Checkout extends React.PureComponent {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      selectedAddressId: '',
      useNewAddress: true,
      shipping: this.getDefaultShipping(props.user),
      paymentMethod: PAYMENT_OPTIONS[0],
      errors: {},
      submitting: false
    };
  }

  componentDidMount() {
    this._isMounted = true;

    const { authenticated, history, cartItems, fetchAddresses, user } =
      this.props;

    if (!authenticated) {
      history.push('/login');
      return;
    }

    if (user?.role === ROLES.Admin) {
      history.push('/dashboard');
      return;
    }

    if (!cartItems || cartItems.length < 1) {
      history.push('/shop');
      return;
    }

    fetchAddresses();
    if (this.props.addresses && this.props.addresses.length > 0) {
      this.initializeFromAddresses(this.props.addresses);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user?.role === ROLES.Admin) {
      if (prevProps.user?.role !== ROLES.Admin) {
        this.props.history.push('/dashboard');
      }
      return;
    }

    if (
      prevProps.addresses !== this.props.addresses &&
      this.props.addresses &&
      this.props.addresses.length > 0
    ) {
      this.initializeFromAddresses(this.props.addresses);
    }

    if (
      prevProps.addresses &&
      prevProps.addresses.length > 0 &&
      this.props.addresses.length === 0 &&
      !this.state.useNewAddress
    ) {
      this.setState({
        selectedAddressId: '',
        useNewAddress: true,
        shipping: {
          ...this.getDefaultShipping(this.props.user),
          note: this.state.shipping.note
        }
      });
    }

    if (prevProps.user !== this.props.user && this.state.useNewAddress) {
      this.setState(prevState => ({
        shipping: {
          ...this.getDefaultShipping(this.props.user),
          address: prevState.shipping.address,
          city: prevState.shipping.city,
          state: prevState.shipping.state,
          country: prevState.shipping.country,
          zipCode: prevState.shipping.zipCode,
          note: prevState.shipping.note
        }
      }));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getDefaultShipping = user => {
    const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

    return {
      fullName: fullName || '',
      phoneNumber: user?.phoneNumber || '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      note: ''
    };
  };

  mapAddressToShipping = address => {
    const defaultShipping = this.getDefaultShipping(this.props.user);

    return {
      ...defaultShipping,
      fullName: address?.fullName || defaultShipping.fullName,
      phoneNumber: address?.phoneNumber || defaultShipping.phoneNumber,
      address: address?.address || '',
      city: address?.city || '',
      state: address?.state || '',
      country: address?.country || '',
      zipCode: address?.zipCode || ''
    };
  };

  initializeFromAddresses = addresses => {
    if (!addresses || addresses.length < 1) {
      return;
    }

    const defaultAddress =
      addresses.find(address => address.isDefault) || addresses[0];

    if (
      !defaultAddress ||
      (!this.state.useNewAddress &&
        this.state.selectedAddressId === defaultAddress._id)
    ) {
      return;
    }

    const shipping = this.mapAddressToShipping(defaultAddress);
    shipping.note = this.state.shipping.note;

    this.setState({
      selectedAddressId: defaultAddress._id,
      useNewAddress: false,
      shipping,
      errors: { ...this.state.errors, addressSelection: undefined }
    });
  };

  handleAddressSelect = address => {
    const shipping = this.mapAddressToShipping(address);
    shipping.note = this.state.shipping.note;

    this.setState({
      selectedAddressId: address._id,
      useNewAddress: false,
      shipping,
      errors: { ...this.state.errors, addressSelection: undefined }
    });
  };

  handleUseNewAddress = () => {
    const defaultShipping = this.getDefaultShipping(this.props.user);
    defaultShipping.note = this.state.shipping.note;

    this.setState({
      selectedAddressId: '',
      useNewAddress: true,
      shipping: defaultShipping
    });
  };

  handleShippingChange = (name, value) => {
    this.setState(prevState => ({
      shipping: {
        ...prevState.shipping,
        [name]: value
      },
      errors: {
        ...prevState.errors,
        [name]: undefined
      }
    }));
  };

  handlePaymentChange = option => {
    this.setState(prevState => ({
      paymentMethod: option,
      errors: {
        ...prevState.errors,
        paymentMethod: undefined
      }
    }));
  };

  validateForm = () => {
    const { shipping, paymentMethod, useNewAddress, selectedAddressId } =
      this.state;
    const errors = {};

    const requiredFields = [
      { field: 'fullName', message: 'Full name is required.' },
      { field: 'phoneNumber', message: 'Phone number is required.' },
      { field: 'address', message: 'Shipping address is required.' },
      { field: 'city', message: 'City is required.' },
      { field: 'country', message: 'Country is required.' },
      { field: 'zipCode', message: 'Zip / Postal code is required.' }
    ];

    requiredFields.forEach(item => {
      const value = sanitizeValue(shipping[item.field]);
      if (!value) {
        errors[item.field] = [item.message];
      }
    });

    const phoneDigits = sanitizeValue(shipping.phoneNumber).replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      errors.phoneNumber = ['Please enter a valid phone number.'];
    }

    if (!paymentMethod) {
      errors.paymentMethod = ['Please choose a payment method.'];
    }

    if (!useNewAddress && !selectedAddressId) {
      errors.addressSelection = [
        'Please select one of your saved addresses or choose a different address.'
      ];
    }

    this.setState({ errors });

    return Object.keys(errors).length === 0;
  };

  buildOrderPayload = () => {
    const { selectedAddressId, useNewAddress, shipping, paymentMethod } =
      this.state;

    const sanitizedShipping = Object.keys(shipping).reduce((acc, key) => {
      acc[key] = sanitizeValue(shipping[key]);
      return acc;
    }, {});

    return {
      paymentMethod: paymentMethod?.value ?? paymentMethod,
      shippingAddress: sanitizedShipping,
      selectedAddressId: useNewAddress ? null : selectedAddressId,
      useNewAddress
    };
  };

  handlePlaceOrder = async event => {
    event.preventDefault();

    const isValid = this.validateForm();

    if (!isValid) {
      return;
    }

    if (!this._isMounted) {
      return;
    }

    this.setState({ submitting: true });

    try {
      const payload = this.buildOrderPayload();
      await this.props.placeOrder(payload);
    } catch (error) {
      // errors are handled via notifications in actions
    } finally {
      if (this._isMounted) {
        this.setState({ submitting: false });
      }
    }
  };

  renderSavedAddresses = () => {
    const { addresses, isAddressLoading } = this.props;
    const { selectedAddressId, useNewAddress, errors } = this.state;

    if (isAddressLoading) {
      return (
        <div className='checkout-address-loading'>
          <LoadingIndicator inline />
        </div>
      );
    }

    if (!addresses || addresses.length < 1) {
      return null;
    }

    return (
      <div className='checkout-address-options'>
        <h4 className='section-title'>Saved Addresses</h4>
        {addresses.map(address => (
          <label
            key={address._id}
            className={`address-option ${
              !useNewAddress && selectedAddressId === address._id
                ? 'selected'
                : ''
            }`}
          >
            <input
              type='radio'
              name='addressOption'
              checked={!useNewAddress && selectedAddressId === address._id}
              onChange={() => this.handleAddressSelect(address)}
            />
            <div className='address-details'>
              <p className='address-recipient'>
                {address.fullName ||
                  `${address.address}, ${address.city}`.slice(0, 80)}
              </p>
              {address.phoneNumber && (
                <p className='address-phone'>{address.phoneNumber}</p>
              )}
              <p className='address-line'>
                {`${address.address ?? ''}${
                  address.city ? `, ${address.city}` : ''
                }${address.state ? `, ${address.state}` : ''}${
                  address.country ? `, ${address.country}` : ''
                }${address.zipCode ? `, ${address.zipCode}` : ''}`}
              </p>
              {address.isDefault && (
                <span className='badge badge-primary'>Default</span>
              )}
            </div>
          </label>
        ))}
        <label
          className={`address-option ${useNewAddress ? 'selected' : ''}`}
        >
          <input
            type='radio'
            name='addressOption'
            checked={useNewAddress}
            onChange={this.handleUseNewAddress}
          />
          <div className='address-details'>
            <p className='address-recipient'>Use a different address</p>
            <p className='address-line'>
              Enter a new shipping address in the form below.
            </p>
          </div>
        </label>
        {errors.addressSelection && (
          <p className='form-error'>{errors.addressSelection[0]}</p>
        )}
      </div>
    );
  };

  renderCartItems = () => {
    const { cartItems } = this.props;

    if (!cartItems || cartItems.length < 1) {
      return null;
    }

    return (
      <div className='checkout-cart-items'>
        {cartItems.map(item => (
          <div className='checkout-cart-item' key={item._id}>
            <div className='item-overview'>
              <img
                src={
                  item.imageUrl
                    ? item.imageUrl
                    : '/images/placeholder-image.png'
                }
                alt={item.name}
                loading='lazy'
                decoding='async'
                onError={event => {
                  if (!event?.target) return;
                  event.target.onerror = null;
                  event.target.src = '/images/placeholder-image.png';
                }}
              />
              <div>
                <p className='item-name'>{item.name}</p>
                <p className='item-meta'>Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className='item-price'>
              ${Number(item.totalPrice || item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { cartItems, cartTotal } = this.props;
    const { shipping, paymentMethod, errors, submitting, useNewAddress } =
      this.state;

    if (!cartItems || cartItems.length < 1) {
      return <div className='checkout-page empty'>Your cart is empty.</div>;
    }

    return (
      <div className='checkout-page'>
        <Row>
          <Col lg='8' className='mb-4'>
            <div className='checkout-section'>
              <h2 className='section-title'>Shipping Information</h2>
              {this.renderSavedAddresses()}
              <form className='shipping-form' noValidate>
                <Row>
                  <Col md='6'>
                    <Input
                      type={'text'}
                      label={'Full Name'}
                      name={'fullName'}
                      placeholder={'Recipient Full Name'}
                      value={shipping.fullName}
                      error={errors.fullName}
                      onInputChange={this.handleShippingChange}
                    />
                  </Col>
                  <Col md='6'>
                    <Input
                      type={'text'}
                      label={'Phone Number'}
                      name={'phoneNumber'}
                      placeholder={'Contact Phone Number'}
                      value={shipping.phoneNumber}
                      error={errors.phoneNumber}
                      onInputChange={this.handleShippingChange}
                    />
                  </Col>
                  <Col md='12'>
                    <Input
                      type={'text'}
                      label={'Address'}
                      name={'address'}
                      placeholder={
                        useNewAddress
                          ? 'Street, Building, Apartment'
                          : 'Shipping Address'
                      }
                      value={shipping.address}
                      error={errors.address}
                      onInputChange={this.handleShippingChange}
                    />
                  </Col>
                  <Col md='6'>
                    <Input
                      type={'text'}
                      label={'City'}
                      name={'city'}
                      placeholder={'City'}
                      value={shipping.city}
                      error={errors.city}
                      onInputChange={this.handleShippingChange}
                    />
                  </Col>
                  <Col md='6'>
                    <Input
                      type={'text'}
                      label={'State / Province'}
                      name={'state'}
                      placeholder={'State / Province'}
                      value={shipping.state}
                      onInputChange={this.handleShippingChange}
                    />
                  </Col>
                  <Col md='6'>
                    <Input
                      type={'text'}
                      label={'Country'}
                      name={'country'}
                      placeholder={'Country'}
                      value={shipping.country}
                      error={errors.country}
                      onInputChange={this.handleShippingChange}
                    />
                  </Col>
                  <Col md='6'>
                    <Input
                      type={'text'}
                      label={'Zip / Postal Code'}
                      name={'zipCode'}
                      placeholder={'Zip / Postal Code'}
                      value={shipping.zipCode}
                      error={errors.zipCode}
                      onInputChange={this.handleShippingChange}
                    />
                  </Col>
                  <Col md='12'>
                    <Input
                      type={'textarea'}
                      label={'Delivery Note (Optional)'}
                      name={'note'}
                      placeholder={'Add a note for the courier'}
                      value={shipping.note}
                      onInputChange={this.handleShippingChange}
                    />
                  </Col>
                </Row>
              </form>
            </div>

            <div className='checkout-section mt-4'>
              <h2 className='section-title'>Payment Method</h2>
              <SelectOption
                label={'Select Payment Method'}
                name={'paymentMethod'}
                value={paymentMethod}
                options={PAYMENT_OPTIONS}
                error={errors.paymentMethod}
                handleSelectChange={this.handlePaymentChange}
              />
            </div>
          </Col>

          <Col lg='4'>
            <div className='checkout-summary-card'>
              <h2 className='section-title'>Order Summary</h2>
              {this.renderCartItems()}
              <CartSummary cartTotal={cartTotal} />
              <Button
                variant='primary'
                className='mt-3 w-100'
                text={submitting ? 'Placing Order...' : 'Place Order'}
                disabled={submitting}
                onClick={this.handlePlaceOrder}
              />
              <p className='checkout-disclaimer mt-3 mb-0'>
                By placing your order you agree to our terms and privacy policy.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    user: state.account.user,
    addresses: state.address.addresses,
    isAddressLoading: state.address.isLoading,
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal
  };
};

export default connect(mapStateToProps, actions)(Checkout);
