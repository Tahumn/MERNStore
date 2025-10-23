/**
 *
 * AdminOverview
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import actions from '../../actions';

import LoadingIndicator from '../../components/Common/LoadingIndicator';

const formatCurrency = value => {
  const amount = Number(value) || 0;
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
};

class AdminOverview extends React.PureComponent {
  componentDidMount() {
    if (!this.props.hasLoaded) {
      this.props.fetchDashboardSummary();
    }
  }

  renderSummaryCards() {
    const { summary } = this.props;

    const cards = [
      {
        key: 'revenue',
        label: 'Total Revenue',
        value: formatCurrency(summary.revenue),
        icon: 'fa-dollar-sign',
        theme: 'primary'
      },
      {
        key: 'orders',
        label: 'Total Orders',
        value: summary.orders,
        icon: 'fa-shopping-bag',
        theme: 'teal'
      },
      {
        key: 'pending',
        label: 'Pending Orders',
        value: summary.pendingOrders,
        icon: 'fa-truck-loading',
        theme: 'warning'
      },
      {
        key: 'customers',
        label: 'Customers',
        value: summary.customers,
        icon: 'fa-users',
        theme: 'purple'
      },
      {
        key: 'products',
        label: 'Active Products',
        value: summary.products,
        icon: 'fa-boxes',
        theme: 'orange'
      }
    ];

    return (
      <Row className='overview-cards'>
        {cards.map(card => (
          <Col key={card.key} xs='12' md='6' xl='4' className='mb-3'>
            <div className={`overview-card ${card.theme}`}>
              <div className='icon'>
                <i className={`fas ${card.icon}`} aria-hidden='true' />
              </div>
              <div className='details'>
                <p className='label'>{card.label}</p>
                <p className='value'>{card.value}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  }

  renderRecentOrders() {
    const { recentOrders } = this.props;

    if (!recentOrders || recentOrders.length === 0) {
      return (
        <div className='panel recent-orders'>
          <div className='panel-header'>
            <h3>Recent Orders</h3>
            <Link to='/dashboard/orders'>View all</Link>
          </div>
          <p className='empty-text'>No recent orders found.</p>
        </div>
      );
    }

    return (
      <div className='panel recent-orders'>
        <div className='panel-header'>
          <h3>Recent Orders</h3>
          <Link to='/dashboard/orders'>View all</Link>
        </div>
        <div className='table-responsive'>
          <table className='table table-sm mb-0'>
            <thead>
              <tr>
                <th scope='col'>Order</th>
                <th scope='col'>Customer</th>
                <th scope='col'>Total</th>
                <th scope='col'>Items</th>
                <th scope='col'>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id}>
                  <td className='order-link'>
                    <Link to={`/order/${order._id}`}>#{order._id.slice(-6)}</Link>
                    <span className='date'>
                      {new Date(order.created).toLocaleDateString()}
                    </span>
                  </td>
                  <td>{order.customer}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>{order.items}</td>
                  <td>
                    <span
                      className={`status-badge status-${order.status
                        .replace(/\s+/g, '-')
                        .toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  renderTopProducts() {
    const { topProducts } = this.props;

    if (!topProducts || topProducts.length === 0) {
      return (
        <div className='panel top-products'>
          <div className='panel-header'>
            <h3>Top Products</h3>
          </div>
          <p className='empty-text'>No product sales data available yet.</p>
        </div>
      );
    }

    return (
      <div className='panel top-products'>
        <div className='panel-header'>
          <h3>Top Products</h3>
        </div>
        <ul className='product-list mb-0'>
          {topProducts.map(product => (
            <li key={product._id} className='product-item'>
              <div className='product-info'>
                <img
                  src={
                    product.imageUrl
                      ? product.imageUrl
                      : '/images/placeholder-image.png'
                  }
                  alt={product.name}
                  loading='lazy'
                  decoding='async'
                  onError={event => {
                    if (!event?.target) return;
                    event.target.onerror = null;
                    event.target.src = '/images/placeholder-image.png';
                  }}
                />
                <div>
                  <p className='name'>{product.name}</p>
                  <p className='meta'>
                    {formatCurrency(product.price)} · {product.totalSold}{' '}
                    sold
                  </p>
                </div>
              </div>
              <Link
                to={`/product/${product.slug || product._id}`}
                className='view-link'
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const { isLoading } = this.props;

    return (
      <div className='admin-overview'>
        <div className='overview-header'>
          <div>
            <h2>Store Performance Overview</h2>
            <p className='text-muted'>Track key metrics and recent activity.</p>
          </div>
        </div>

        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {this.renderSummaryCards()}
            <Row>
              <Col lg='7'>{this.renderRecentOrders()}</Col>
              <Col lg='5'>{this.renderTopProducts()}</Col>
            </Row>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    summary: state.dashboard.summary,
    recentOrders: state.dashboard.recentOrders,
    topProducts: state.dashboard.topProducts,
    isLoading: state.dashboard.isLoading,
    hasLoaded: state.dashboard.hasLoaded
  };
};

export default connect(mapStateToProps, actions)(AdminOverview);
