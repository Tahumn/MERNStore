/*
 *
 * MerchantLogin
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class MerchantLogin extends React.PureComponent {
  render() {
    const {
      authenticated,
      loginFormData,
      loginChange,
      login,
      formErrors,
      isLoading,
      isSubmitting
    } = this.props;

    if (authenticated) return <Redirect to='/dashboard' />;

    const handleSubmit = event => {
      event.preventDefault();
      login();
    };

    return (
      <div className='merchant-auth-layout'>
        <div className='merchant-auth-card'>
          {isLoading && <LoadingIndicator />}
          <h2 className='text-center mb-3'>Merchant Portal</h2>
          <p className='text-center text-muted mb-4'>
            Use this login if you have been approved as a merchant or supplier.
          </p>
          <form onSubmit={handleSubmit} noValidate>
            <Input
              type={'text'}
              error={formErrors['email']}
              label={'Email Address'}
              name={'email'}
              placeholder={'Enter your merchant email'}
              value={loginFormData.email}
              onInputChange={(name, value) => {
                loginChange(name, value);
              }}
            />
            <Input
              type={'password'}
              error={formErrors['password']}
              label={'Password'}
              name={'password'}
              placeholder={'Enter your password'}
              value={loginFormData.password}
              onInputChange={(name, value) => {
                loginChange(name, value);
              }}
            />
            <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between mt-3'>
              <Button
                type='submit'
                variant='primary'
                text='Login'
                disabled={isSubmitting}
              />
              <Link
                className='redirect-link mt-3 mt-md-0'
                to={'/forgot-password'}
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    loginFormData: state.login.loginFormData,
    formErrors: state.login.formErrors,
    isLoading: state.login.isLoading,
    isSubmitting: state.login.isSubmitting
  };
};

export default connect(mapStateToProps, actions)(MerchantLogin);
