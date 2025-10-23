/**
 *
 * Homepage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import actions from '../../actions';
import banners from './banners.json';
import CarouselSlider from '../../components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils';
import ProductList from '../../components/Store/ProductList';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import Button from '../../components/Common/Button';
import CartList from '../../components/Store/CartList';
import CartSummary from '../../components/Store/CartSummary';
import { ROLES } from '../../constants';

class Homepage extends React.PureComponent {
  componentDidMount() {
    this.props.fetchFeaturedProducts();

    if (this.props.authenticated) {
      this.props.fetchPopularProducts();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchPopularProducts();
    }
  }

  render() {
    const {
      featuredProducts,
      isFeaturedLoading,
      popularProducts,
      isPopularLoading,
      updateWishlist,
      authenticated,
      quickAddToCart,
      user,
      cartItems,
      cartTotal,
      handleRemoveFromCart,
      updateCartItemQuantity,
      startCheckout,
    } = this.props;
    const { history } = this.props;
    const firstName = user?.firstName;
    const hasCartItems = cartItems && cartItems.length > 0;
    const spotlightProducts = featuredProducts.slice(0, 3);
    const isAdmin = user?.role === ROLES.Admin;

    return (
      <div className='homepage'>
        <div className='homepage-hero px-3 px-md-2 mb-4'>
          <div className='hero-panel'>
            <div className='hero-copy'>
              <h1 className='hero-title mb-3'>
                {authenticated
                  ? `Welcome back${firstName ? `, ${firstName}` : ''}!`
                  : 'Discover products picked for modern living.'}
              </h1>
              <p className='hero-text text-muted mb-4'>
                {authenticated
                  ? 'Jump right into today’s top-rated items and keep your store on track.'
                  : 'Browse curated collections, compare prices, and find something you will love in seconds.'}
              </p>
            </div>
            <div className='hero-actions d-flex flex-column flex-md-row'>
              <Button
                variant='primary'
                text='Shop Now'
                onClick={() => history.push('/shop')}
              />
              {authenticated && (
                <Button
                  variant='secondary'
                  className='mt-3 mt-md-0 ml-md-3'
                  text='Go to Dashboard'
                  onClick={() => history.push('/dashboard')}
                />
              )}
            </div>
          </div>
        </div>
        <Row className='flex-row'>
          <Col xs='12' lg='6' className='order-lg-2 mb-3 px-3 px-md-2'>
            <div className='home-carousel'>
              <CarouselSlider
                swipeable={true}
                showDots={true}
                infinite={true}
                autoPlay={false}
                slides={banners}
                responsive={responsiveOneItemCarousel}
              >
                {banners.map((item, index) => (
                  <img key={index} src={item.imageUrl} />
                ))}
              </CarouselSlider>
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-1 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='/images/banners/banner-5.jpg' />
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-3 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='/images/banners/banner-6.jpg' />
            </div>
          </Col>
        </Row>
        {spotlightProducts.length > 0 && (
          <div className='homepage-spotlight px-3 px-md-2 mb-5'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
              <h2 className='section-title mb-0'>Sản phẩm nổi bật</h2>
              <Link className='section-link text-uppercase' to='/shop'>
                Xem tất cả
              </Link>
            </div>
            <Row>
              {spotlightProducts.map(item => (
                <Col key={item._id} xs='12' md='4' className='mb-3'>
                  <div className='spotlight-card'>
                    <div className='spotlight-image'>
                      <img
                        src={item.imageUrl || '/images/placeholder-image.png'}
                        alt={item.name}
                        loading='lazy'
                        decoding='async'
                      />
                    </div>
                    <div className='spotlight-body'>
                      <h3 className='spotlight-title'>{item.name}</h3>
                      <p className='spotlight-description'>
                        {item.description}
                      </p>
                      <div className='d-flex justify-content-between align-items-center mt-3'>
                        <span className='spotlight-price'>${item.price}</span>
                        <Button
                          size='sm'
                          text='Thêm vào giỏ'
                          onClick={() => quickAddToCart(item)}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <div className='homepage-featured px-3 px-md-2'>
          <div className='d-flex align-items-center justify-content-between mb-3'>
            <h2 className='section-title mb-0'>Featured Products</h2>
            <Link className='section-link text-uppercase' to='/shop'>
              Explore Shop
            </Link>
          </div>
          {isFeaturedLoading ? (
            <LoadingIndicator inline />
          ) : featuredProducts.length > 0 ? (
            <ProductList
              products={featuredProducts}
              updateWishlist={updateWishlist}
              authenticated={authenticated}
              allowWishlist={!isAdmin}
              canPurchase={!isAdmin}
              onAddToCart={isAdmin ? undefined : quickAddToCart}
            />
          ) : (
            <p className='text-muted mb-0'>No featured products available yet.</p>
          )}
        </div>
        {authenticated && (
          <div className='homepage-popular px-3 px-md-2 mt-5'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
              <div>
                <h2 className='section-title mb-1'>Popular with Customers</h2>
                <p className='section-subtitle mb-0 text-muted'>
                  Highly-rated items our shoppers love right now.
                </p>
              </div>
              <Link className='section-link text-uppercase' to='/shop'>
                View All
              </Link>
            </div>
            {isPopularLoading ? (
              <LoadingIndicator inline />
            ) : popularProducts.length > 0 ? (
              <ProductList
                products={popularProducts}
                updateWishlist={updateWishlist}
                authenticated={authenticated}
                allowWishlist={!isAdmin}
                canPurchase={!isAdmin}
                onAddToCart={isAdmin ? undefined : quickAddToCart}
              />
            ) : (
              <p className='text-muted mb-0'>
                We are gathering data to recommend your next favourites.
              </p>
            )}
          </div>
        )}

        {hasCartItems && (
          <div className='homepage-cart px-3 px-md-2 mt-5'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
              <div>
                <h2 className='section-title mb-1'>Giỏ hàng của bạn</h2>
                <p className='section-subtitle mb-0 text-muted'>
                  Cập nhật số lượng hoặc tiếp tục thanh toán.
                </p>
              </div>
              <div className='d-flex align-items-center'>
                <Button
                  variant='link'
                  text='Thanh toán'
                  onClick={startCheckout}
                />
              </div>
            </div>
            <CartList
              cartItems={cartItems}
              handleRemoveFromCart={handleRemoveFromCart}
              updateCartItemQuantity={updateCartItemQuantity}
              toggleCart={() => {}}
            />
            <div className='homepage-cart-summary mt-3'>
              <CartSummary cartTotal={cartTotal} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    featuredProducts: state.homepage.featuredProducts,
    isFeaturedLoading: state.homepage.isLoading,
    popularProducts: state.homepage.popularProducts,
    isPopularLoading: state.homepage.isPopularLoading,
    authenticated: state.authentication.authenticated,
    user: state.account.user,
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal
  };
};

export default connect(mapStateToProps, actions)(Homepage);
