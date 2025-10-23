/**
 *
 * CategoryShop
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';
import { ROLES } from '../../constants';

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class CategoryShop extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.filterProducts('category', slug);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const slug = this.props.match.params.slug;
      this.props.filterProducts('category', slug);
    }
  }

  render() {
    const {
      products,
      isLoading,
      authenticated,
      updateWishlist,
      quickAddToCart,
      userRole
    } = this.props;

    const isAdmin = userRole === ROLES.Admin;

    return (
      <div className='category-shop'>
        {isLoading && <LoadingIndicator />}
        {products && products.length > 0 && (
          <ProductList
            products={products}
            authenticated={authenticated}
            updateWishlist={updateWishlist}
            allowWishlist={!isAdmin}
            canPurchase={!isAdmin}
            onAddToCart={isAdmin ? undefined : quickAddToCart}
          />
        )}
        {!isLoading && products && products.length <= 0 && (
          <NotFound message='No products found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated,
    userRole: state.account.user?.role
  };
};

export default connect(mapStateToProps, actions)(CategoryShop);
