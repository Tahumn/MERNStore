/*
 *
 * Cart
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import CartList from '../../components/Store/CartList';
import CartSummary from '../../components/Store/CartSummary';
import Checkout from '../../components/Store/Checkout';
import { BagIcon, CloseIcon } from '../../components/Common/Icon';
import Button from '../../components/Common/Button';
import { useCartOverlay } from '../../contexts/CartOverlay';

const Cart = ({
  cartItems,
  cartTotal,
  handleShopping,
  handleCheckout,
  handleRemoveFromCart,
  startCheckout,
  authenticated,
  updateCartItemQuantity
}) => {
  const { showCart, closeCart } = useCartOverlay();

  if (!showCart) {
    return null;
  }

  const handleCloseCart = () => closeCart();
  const handleContinueShopping = () => {
    closeCart();
    handleShopping();
  };
  const handleCheckoutClick = () => {
    closeCart();
    handleCheckout();
  };
  const handleStartCheckout = () => {
    closeCart();
    startCheckout();
  };

  return (
    <div className='cart-overlay' aria-hidden={`${!showCart}`}>
      <div className='cart-overlay__backdrop' onClick={handleCloseCart} />
      <div className='cart-sidebar' role='dialog' aria-label='Shopping cart'>
        <div className='cart'>
          <div className='cart-header'>
            <Button
              borderless
              variant='empty'
              ariaLabel='close the cart'
              icon={<CloseIcon />}
              onClick={handleCloseCart}
            />
          </div>
          {cartItems.length > 0 ? (
            <div className='cart-body'>
              <CartList
                onCloseCart={handleCloseCart}
                cartItems={cartItems}
                handleRemoveFromCart={handleRemoveFromCart}
                updateCartItemQuantity={updateCartItemQuantity}
              />
            </div>
          ) : (
            <div className='empty-cart'>
              <BagIcon />
              <p>Your shopping cart is empty</p>
            </div>
          )}
          {cartItems.length > 0 && (
            <div className='cart-checkout'>
              <CartSummary cartTotal={cartTotal} />
              <Checkout
                handleShopping={handleContinueShopping}
                handleCheckout={handleCheckoutClick}
                startCheckout={handleStartCheckout}
                authenticated={authenticated}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal,
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(Cart);
