/**
 *
 * Application
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';

import actions from '../../actions';

// routes
import Login from '../Login';
import Signup from '../Signup';
import MerchantSignup from '../MerchantSignup';
import MerchantLogin from '../MerchantLogin';
import HomePage from '../Homepage';
import Dashboard from '../Dashboard';
import Support from '../Support';
import Navigation from '../Navigation';
import Authentication from '../Authentication';
import Notification from '../Notification';
import ForgotPassword from '../ForgotPassword';
import ResetPassword from '../ResetPassword';
import Shop from '../Shop';
import BrandsPage from '../BrandsPage';
import ProductPage from '../ProductPage';
import Sell from '../Sell';
import Contact from '../Contact';
import OrderSuccess from '../OrderSuccess';
import OrderPage from '../OrderPage';
import Checkout from '../Checkout';
import AuthSuccess from '../AuthSuccess';
import Cart from '../Cart';

import Footer from '../../components/Common/Footer';
import Page404 from '../../components/Common/Page404';
import { CART_ITEMS, ROLES } from '../../constants';
import { getProfileToken } from '../../utils/profile';

class Application extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleStorage = this.handleStorage.bind(this);
  }
  componentDidMount() {
    const token = getProfileToken();

    if (token) {
      this.props.fetchProfile();
    }

    this.props.handleCart();

    document.addEventListener('keydown', this.handleTabbing);
    document.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('storage', this.handleStorage);
  }

  handleStorage(e) {
    if (e.key === CART_ITEMS) {
      this.props.handleCart();
    }
  }

  handleTabbing(e) {
    if (e.keyCode === 9) {
      document.body.classList.add('user-is-tabbing');
    }
  }

  handleMouseDown() {
    document.body.classList.remove('user-is-tabbing');
  }

  render() {
    const { authenticated, user, location } = this.props;
    const isAdmin = authenticated && user?.role === ROLES.Admin;
    const isMerchantStandalone = /^\/merchant\//.test(
      location?.pathname ?? ''
    );

    return (
      <div
        className={`application${
          isMerchantStandalone ? ' application--merchant' : ''
        }`}
      >
        <Notification />
        {!isMerchantStandalone && <Navigation />}
        {!isMerchantStandalone && <Cart />}
        <main className='main'>
          <Container fluid={isAdmin && !isMerchantStandalone}>
            <div className='wrapper'>
              <Switch>
                <Route
                  exact
                  path='/'
                  render={props =>
                    isAdmin ? <Redirect to='/dashboard' /> : <HomePage {...props} />
                  }
                />
                <Route path='/shop' component={Shop} />
                <Route path='/sell' component={Sell} />
                <Route path='/contact' component={Contact} />
                <Route path='/brands' component={BrandsPage} />
                <Route path='/product/:slug' component={ProductPage} />
                <Route path='/order/success/:id' component={OrderSuccess} />
                <Route path='/order/:id' component={OrderPage} />
                <Route
                  path='/checkout'
                  component={Authentication(Checkout)}
                />
                <Route path='/login' component={Login} />
                <Route path='/merchant/login' component={MerchantLogin} />
                <Route path='/register' component={Signup} />
                <Route
                  path='/merchant/signup/:token'
                  component={MerchantSignup}
                />
                <Route path='/forgot-password' component={ForgotPassword} />
                <Route
                  path='/reset-password/:token'
                  component={ResetPassword}
                />
                <Route path='/auth/success' component={AuthSuccess} />
                <Route path='/support' component={Authentication(Support)} />
                <Route
                  path='/dashboard'
                  component={Authentication(Dashboard)}
                />
                <Route path='/404' component={Page404} />
                <Route path='*' component={Page404} />
              </Switch>
            </div>
          </Container>
        </main>
        {!isAdmin && !isMerchantStandalone && <Footer />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    products: state.product.storeProducts,
    user: state.account.user
  };
};

export default withRouter(connect(mapStateToProps, actions)(Application));
