/**
 *
 * OrderMeta
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { CART_ITEM_STATUS, ROLES } from '../../../constants';
import { formatDate } from '../../../utils/date';
import Button from '../../Common/Button';
import { ArrowBackIcon } from '../../Common/Icon';

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

const OrderMeta = props => {
  const { order, cancelOrder, onBack, onCompleteOrder, user } = props;

  const renderMetaAction = () => {
    const isCustomer = user?.role !== ROLES.Admin;
    if (!isCustomer) return null;

    const products = order.products || [];
    if (!products.length) return null;
    const nonCancelled = products.filter(
      i => i.status !== CART_ITEM_STATUS.Cancelled
    );
    const allDeliveredOrCompleted =
      nonCancelled.length > 0 &&
      nonCancelled.every(item =>
        [CART_ITEM_STATUS.Delivered, CART_ITEM_STATUS.Completed].includes(
          item.status
        )
      );
    const allCompleted =
      nonCancelled.length > 0 &&
      nonCancelled.every(item => item.status === CART_ITEM_STATUS.Completed);
    const hasDelivered = nonCancelled.some(
      item => item.status === CART_ITEM_STATUS.Delivered
    );

    if (allDeliveredOrCompleted && !allCompleted) {
      return (
        <Button size='sm' variant='primary' text='Complete Order' onClick={onCompleteOrder} />
      );
    }

    if (!hasDelivered && !allCompleted && nonCancelled.length > 0) {
      return <Button size='sm' text='Cancel Order' onClick={cancelOrder} />;
    }
  };

  const shipping = order?.shipping || {};
  const shippingLines = [
    shipping.address,
    [shipping.city, shipping.state].filter(Boolean).join(', '),
    [shipping.country, shipping.zipCode].filter(Boolean).join(' ')
  ].filter(line => line && line.trim().length > 0);

  return (
    <div className='order-meta'>
      <div className='d-flex align-items-center justify-content-between mb-3 title'>
        <h2 className='mb-0'>Order Details</h2>
        <Button
          variant='link'
          icon={<ArrowBackIcon />}
          size='sm'
          text='Back to orders'
          onClick={onBack}
        ></Button>
      </div>

      <Row>
        <Col xs='12' md='8'>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Order ID</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${order._id}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Order Date</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${formatDate(
                order.created
              )}`}</span>
            </Col>
          </Row>
        </Col>
        <Col xs='12' md='4' className='text-left text-md-right'>
          {renderMetaAction()}
        </Col>
      </Row>
      {(shipping.fullName || shippingLines.length > 0 || shipping.phoneNumber) && (
        <Row className='mt-3'>
          <Col xs='12' md='6' className='mb-3 mb-md-0'>
            <p className='order-meta-heading'>Shipping To</p>
            <div className='order-shipping-box'>
              {shipping.fullName && (
                <p className='order-label mb-1'>{shipping.fullName}</p>
              )}
              {shipping.phoneNumber && (
                <p className='order-label mb-1'>{shipping.phoneNumber}</p>
              )}
              {shippingLines.map((line, index) => (
                <p key={`shipping-line-${index}`} className='order-label mb-1'>
                  {line}
                </p>
              ))}
              {shipping.note && (
                <p className='order-note mb-0'>Note: {shipping.note}</p>
              )}
            </div>
          </Col>
          <Col xs='12' md='6'>
            <p className='order-meta-heading'>Payment Method</p>
            <p className='order-label mb-0'>
              {formatPaymentMethod(order?.payment?.method)}
            </p>
            {order?.payment?.status && (
              <p className='order-status mt-1 mb-0'>{order.payment.status}</p>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default OrderMeta;
