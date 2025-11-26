/*
 *
 * Sell
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';

import LoadingIndicator from '../../components/Common/LoadingIndicator';
import AddMerchant from '../../components/Manager/AddMerchant';

class Sell extends React.PureComponent {
  render() {
    const {
      merchantFormData,
      formErrors,
      merchantChange,
      addMerchant,
      isSubmitting,
      isLoading
    } = this.props;

    return (
      <div className='sell'>
        {isLoading && <LoadingIndicator />}
        <h3 className='text-uppercase'>Become A MERN Store Seller!</h3>
        <hr />
        <Row>
          <Col xs='12' md='6' className='order-2 order-md-1'>
            <AddMerchant
              merchantFormData={merchantFormData}
              formErrors={formErrors}
              isSubmitting={isSubmitting}
              submitTitle='Submit'
              merchantChange={merchantChange}
              addMerchant={addMerchant}
            />
            <p className='mt-3 text-muted small'>
              After you submit the form our admin team must approve your request.
              Once approved, you will receive an email titled <b>Merchant Signup</b>{' '}
              with a secure link to create your password before you can access the portal.
            </p>
            <p className='text-muted small'>
              Already approved? <Link to='/merchant/login'>Log in to the Merchant Portal</Link>
            </p>
          </Col>
          <Col xs='12' md='6' className='order-1 order-md-2'>
            <Row>
              <Col xs='12' className='order-2 order-md-1 text-md-center mb-3'>
                <div className='agreement-banner-text'>
                  <h3>Would you like to sell your products on MERN Store!</h3>
                  <h5>Grow your business with MERN Store</h5>
                  <b>Apply Today</b>
                </div>
              </Col>

              <Col
                xs='12'
                className='order-1 order-md-2 text-center mb-3 mb-md-0'
              >
                <img
                  className='agreement-banner'
                  src={'/images/banners/agreement.svg'}
                  alt='agreement banner'
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    merchantFormData: state.merchant.merchantFormData,
    formErrors: state.merchant.formErrors,
    isSubmitting: state.merchant.isSubmitting,
    isLoading: state.merchant.isLoading
  };
};

export default connect(mapStateToProps, actions)(Sell);
