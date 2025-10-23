/**
 *
 * CartList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Button from '../../Common/Button';
import Input from '../../Common/Input';

const CartList = props => {
  const { cartItems, handleRemoveFromCart, updateCartItemQuantity } = props;

  const handleImageError = event => {
    if (!event?.target) return;
    event.target.onerror = null;
    event.target.src = '/images/placeholder-image.png';
  };

  const handleProductClick = () => {
    props.toggleCart();
  };

  const handleQuantityChange = (item, value) => {
    if (!updateCartItemQuantity) {
      return;
    }

    updateCartItemQuantity(item._id, value);
  };

  const getAvailableQuantity = item => {
    return (
      item?.inventory ??
      item?.quantityAvailable ??
      item?.stock ??
      item?.maxQuantity ??
      item?.available ??
      item.quantity ??
      1
    );
  };

  const formatPrice = price => {
    const numeric = Number(price);

    if (Number.isNaN(numeric)) {
      return '0.00';
    }

    return numeric.toFixed(2);
  };

  return (
    <div className='cart-list'>
      {cartItems.map(item => {
        const itemKey =
          item?._id ||
          item?.product?._id ||
          `${item?.product}-${item?.slug || item?.name}`;

        return (
          <div key={itemKey} className='item-box'>
            <div className='item-details'>
              <Container>
                <Row className='mb-2 align-items-center'>
                  <Col xs='10' className='pr-0'>
                    <div className='d-flex align-items-center'>
                      <img
                        className='item-image mr-2'
                        src={`${
                          item.imageUrl
                            ? item.imageUrl
                            : '/images/placeholder-image.png'
                        }`}
                        loading='lazy'
                        decoding='async'
                        onError={handleImageError}
                      />

                      <Link
                        to={`/product/${item.slug}`}
                        className='item-link one-line-ellipsis'
                        onClick={handleProductClick}
                      >
                        <h2 className='item-name one-line-ellipsis'>
                          {item.name}
                        </h2>
                      </Link>
                    </div>
                  </Col>
                  <Col xs='2' className='text-right'>
                    <Button
                      borderless
                      variant='empty'
                      ariaLabel={`remove ${item.name} from cart`}
                      icon={<i className='icon-trash' aria-hidden='true' />}
                      onClick={() => handleRemoveFromCart(item)}
                    />
                  </Col>
                </Row>
                <Row className='mb-2 align-items-center'>
                  <Col xs='9'>
                    <p className='item-label'>price</p>
                  </Col>
                  <Col xs='3' className='text-right'>
                    <p className='value price'>{` $${formatPrice(
                      item.totalPrice
                    )}`}</p>
                  </Col>
                </Row>
                <Row className='mb-2 align-items-center'>
                  <Col xs='12'>
                    <Input
                      type={'number'}
                      label={'Quantity'}
                      name={`quantity-${item._id}`}
                      decimals={false}
                      min={1}
                      max={getAvailableQuantity(item)}
                      value={item.quantity}
                      onInputChange={(name, value) =>
                        handleQuantityChange(item, value)
                      }
                    />
                    <p className='item-label quantity-available mb-0'>
                      {`Available: ${getAvailableQuantity(item)}`}
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartList;
