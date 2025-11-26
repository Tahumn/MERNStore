/*
 *
 * MerchantSignup
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';

class MerchantSignup extends React.PureComponent {
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const email = params.get('email');
    if (email) {
      this.props.merchantSignupChange('email', decodeURIComponent(email));
    }
  }

  render() {
    const {
      signupFormData,
      formErrors,
      merchantSignupChange,
      merchantSignUp
    } = this.props;

    const handleSubmit = event => {
      const token = this.props.match.params.token;
      event.preventDefault();

      merchantSignUp(token);
    };

    return (
      <div className='merchant-auth-layout'>
        <div className='merchant-auth-card'>
          <form onSubmit={handleSubmit} noValidate>
            <Row>
              <Col xs='12'>
                <h2 className='text-center'>Create Merchant Password</h2>
                <p className='text-center text-muted mb-4'>
                  You received this link after your application was approved. Confirm
                  your information to create the password for your merchant portal.
                </p>
              </Col>

              <Col xs='12'>
                <Input
                  type={'text'}
                  error={formErrors['email']}
                  label={'Email Address'}
                  name={'email'}
                  placeholder={'Enter your merchant email'}
                  value={signupFormData.email}
                  onInputChange={(name, value) => {
                    merchantSignupChange(name, value);
                  }}
                />
              </Col>
              <Col xs='12'>
                <Input
                  type={'text'}
                  error={formErrors['firstName']}
                  label={'First Name'}
                  name={'firstName'}
                  placeholder={'Enter your first name'}
                  value={signupFormData.firstName}
                  onInputChange={(name, value) => {
                    merchantSignupChange(name, value);
                  }}
                />
              </Col>
              <Col xs='12'>
                <Input
                  type={'text'}
                  error={formErrors['lastName']}
                  label={'Last Name'}
                  name={'lastName'}
                  placeholder={'Enter your last name'}
                  value={signupFormData.lastName}
                  onInputChange={(name, value) => {
                    merchantSignupChange(name, value);
                  }}
                />
              </Col>
              <Col xs='12'>
                <Input
                  type={'password'}
                  label={'Password'}
                  error={formErrors['password']}
                  name={'password'}
                  placeholder={'Create a password'}
                  value={signupFormData.password}
                  onInputChange={(name, value) => {
                    merchantSignupChange(name, value);
                  }}
                />
              </Col>
              <Col xs='12'>
                <Button
                  className='mt-3 w-100'
                  type='submit'
                  variant='primary'
                  text='Save & Continue'
                />
              </Col>
            </Row>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    signupFormData: state.merchant.signupFormData,
    formErrors: state.merchant.signupFormErrors
  };
};

export default connect(mapStateToProps, actions)(MerchantSignup);

