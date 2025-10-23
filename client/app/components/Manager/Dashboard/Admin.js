/*
 *
 * Admin
 *
 */

import React from 'react';

import { Switch, Route } from 'react-router-dom';

import AdminSidebar from '../AdminSidebar';
import Button from '../../Common/Button';
import Page404 from '../../Common/Page404';

import Account from '../../../containers/Account';
import AccountSecurity from '../../../containers/AccountSecurity';
import Address from '../../../containers/Address';
import Order from '../../../containers/Order';
import Users from '../../../containers/Users';
import Category from '../../../containers/Category';
import Product from '../../../containers/Product';
import Brand from '../../../containers/Brand';
import Merchant from '../../../containers/Merchant';
import Review from '../../../containers/Review';
import Wishlist from '../../../containers/WishList';
import AdminOverview from '../../../containers/AdminOverview';

const Admin = props => {
  const { isMenuOpen, toggleMenu } = props;

  return (
    <div className={`admin-dashboard ${isMenuOpen ? 'menu-open' : ''}`}>
      <AdminSidebar {...props} />
      <div className='admin-dashboard-panel'>
        <div className='admin-dashboard-toolbar d-lg-none'>
          <Button
            variant='dark'
            className='w-100'
            text={isMenuOpen ? 'Close Navigation' : 'Open Navigation'}
            onClick={toggleMenu}
          />
        </div>
        <div className='admin-dashboard-content'>
          <Switch>
            <Route exact path='/dashboard' component={AdminOverview} />
            <Route path='/dashboard/profile' component={Account} />
            <Route path='/dashboard/security' component={AccountSecurity} />
            <Route path='/dashboard/address' component={Address} />
            <Route path='/dashboard/product' component={Product} />
            <Route path='/dashboard/category' component={Category} />
            <Route path='/dashboard/brand' component={Brand} />
            <Route path='/dashboard/users' component={Users} />
            <Route path='/dashboard/merchant' component={Merchant} />
            <Route path='/dashboard/orders' component={Order} />
            <Route path='/dashboard/review' component={Review} />
            <Route path='/dashboard/wishlist' component={Wishlist} />
            <Route path='*' component={Page404} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Admin;
