/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import AddToWishList from '../AddToWishList';
import Button from '../../Common/Button';

const ProductList = props => {
  const {
    products,
    updateWishlist,
    authenticated,
    onAddToCart,
    canPurchase = true,
    allowWishlist = true
  } = props;
  const enableAddToCart = typeof onAddToCart === 'function' && canPurchase;
  const canWishlist = allowWishlist && authenticated;

  const handleImageError = event => {
    if (!event?.target) return;
    event.target.onerror = null;
    event.target.src = '/images/placeholder-image.png';
  };

  const handleAddToCartClick = (event, item) => {
    event.preventDefault();
    event.stopPropagation();

    if (enableAddToCart) {
      onAddToCart(item);
    }
  };

  return (
    <div className='product-list'>
      {products.map(product => {
        const itemKey =
          product?._id || product?.slug || product?.sku || product?.name;
        const availableStock =
          Number(product?.inventory ?? product?.quantity ?? 0) || 0;
        const isOutOfStock = availableStock < 1;

        return (
          <div key={itemKey} className='mb-3 mb-md-0'>
            <div className='product-container'>
              <div className='item-box'>
                {canWishlist && (
                  <div className='add-wishlist-box'>
                    <AddToWishList
                      id={product._id}
                      liked={product?.isLiked ?? false}
                      enabled={canWishlist}
                      updateWishlist={updateWishlist}
                      authenticated={authenticated}
                    />
                  </div>
                )}

                <div className='item-link'>
                  <Link
                    to={`/product/${product.slug}`}
                    className='d-flex flex-column h-100'
                  >
                    <div className='item-image-container'>
                      <div className='item-image-box'>
                        <img
                          className='item-image'
                          src={`${
                            product.imageUrl
                              ? product.imageUrl
                              : '/images/placeholder-image.png'
                          }`}
                          loading='lazy'
                          decoding='async'
                          onError={handleImageError}
                        />
                      </div>
                    </div>
                    <div className='item-body'>
                      <div className='item-details p-3'>
                        <h1 className='item-name'>{product.name}</h1>
                        {product.brand &&
                          Object.keys(product.brand).length > 0 && (
                            <p className='by'>
                              By <span>{product.brand.name}</span>
                            </p>
                          )}
                        <p className='item-desc mb-0'>{product.description}</p>
                      </div>
                    </div>
                    <div className='d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer'>
                      <p className='price mb-0'>${product.price}</p>
                      {product.totalReviews > 0 && (
                        <p className='mb-0'>
                          <span className='fs-16 fw-normal mr-1'>
                            {parseFloat(product?.averageRating).toFixed(1)}
                          </span>
                          <span
                            className={`fa fa-star ${
                              product.totalReviews !== 0 ? 'checked' : ''
                            }`}
                            style={{ color: '#ffb302' }}
                          ></span>
                        </p>
                      )}
                    </div>
                  </Link>
                  {enableAddToCart && (
                    <div className='item-actions px-4 pb-3'>
                      <Button
                        variant='primary'
                        size='sm'
                        disabled={isOutOfStock}
                        text={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        onClick={event => handleAddToCartClick(event, product)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
