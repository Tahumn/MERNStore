/**
 *
 * OrderList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import { formatDate } from '../../../utils/date';

const PAYMENT_LABELS = {
  COD: 'Cash on Delivery',
  BANK_TRANSFER: 'Bank Transfer',
  EWALLET: 'E-Wallet / QR Payment',
  CARD: 'Credit / Debit Card (Offline)'
};

const formatPaymentMethod = method => {
  if (!method) {
    return 'Not specified';
  }

  return PAYMENT_LABELS[method] ?? method;
};

const OrderList = props => {
  const { orders } = props;

  const renderFirstItem = order => {
    if (order.products) {
      const product = order.products[0].product;
      return (
        <img
          className='item-image'
          src={`${
            product && product?.imageUrl
              ? product?.imageUrl
              : '/images/placeholder-image.png'
          }`}
        />
      );
    } else {
      return <img className='item-image' src='/images/placeholder-image.png' />;
    }
  };

  return (
    <div className='order-list'>
      {orders.map((order, index) => (
        <div key={index} className='order-box'>
          <Link to={`/order/${order._id}`} className='d-block box-link'>
            <div className='d-flex flex-column flex-lg-row mb-3'>
              <div className='order-first-item p-lg-3'>
                {renderFirstItem(order)}
              </div>
              <div className='d-flex flex-column flex-xl-row justify-content-between flex-1 ml-lg-2 mr-xl-4 p-3'>
                <div className='order-details'>
                  <div className='mb-1'>
                    <span>Status</span>
                    {order?.products ? (
                      <span className='order-label order-status'>{` ${order?.products[0].status}`}</span>
                    ) : (
                      <span className='order-label order-status'>{` Unavailable`}</span>
                    )}
                  </div>
                  <div className='mb-1'>
                    <span>Order #</span>
                    <span className='order-label'>{` ${order._id}`}</span>
                  </div>
                  <div className='mb-1'>
                    <span>Ordered on</span>
                    <span className='order-label'>{` ${formatDate(
                      order.created
                    )}`}</span>
                  </div>
                  <div className='mb-1'>
                    <span>Order Total</span>
                    <span className='order-label'>{` $${
                      order?.totalWithTax ? order?.totalWithTax : 0
                    }`}</span>
                  </div>
                  {order?.shipping?.fullName && (
                    <div className='mb-1'>
                      <span>Ship to</span>
                      <span className='order-label'>{` ${order.shipping.fullName}`}</span>
                    </div>
                  )}
                  {order?.shipping?.phoneNumber && (
                    <div className='mb-1'>
                      <span>Contact</span>
                      <span className='order-label'>{` ${order.shipping.phoneNumber}`}</span>
                    </div>
                  )}
                  <div className='mb-1'>
                    <span>Payment</span>
                    <span className='order-label'>{` ${formatPaymentMethod(
                      order?.payment?.method
                    )}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
