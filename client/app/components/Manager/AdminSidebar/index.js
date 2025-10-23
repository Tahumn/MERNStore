import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../Common/Button';

const iconMap = {
  '': 'fa-th-large',
  '/profile': 'fa-id-card',
  '/security': 'fa-lock',
  '/address': 'fa-map-marker-alt',
  '/product': 'fa-box-open',
  '/category': 'fa-th-list',
  '/brand': 'fa-tags',
  '/users': 'fa-users-cog',
  '/merchant': 'fa-store',
  '/orders': 'fa-shopping-basket',
  '/review': 'fa-star',
  '/wishlist': 'fa-heart',
  '/support': 'fa-headset'
};

const getInitials = user => {
  const first = user?.firstName?.[0] || '';
  const last = user?.lastName?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'A';
};

const isProviderAllowed = (link, user) => {
  if (!link.provider) {
    return true;
  }

  const userProvider = user?.provider || '';
  if (!userProvider) {
    return true;
  }

  return link.provider.includes(userProvider);
};

const buildPath = link => {
  const prefix = link.prefix || '';
  if (!link.to) {
    return prefix || '/dashboard';
  }
  return `${prefix || ''}${link.to}`;
};

const AdminSidebar = ({ user, links, isMenuOpen, toggleMenu }) => {
  const handleNavLinkClick = useCallback(() => {
    if (
      isMenuOpen &&
      typeof window !== 'undefined' &&
      window.innerWidth < 992
    ) {
      toggleMenu();
    }
  }, [isMenuOpen, toggleMenu]);

  return (
    <aside className={`admin-sidebar ${isMenuOpen ? 'open' : ''}`}>
      <div className='sidebar-header'>
        <div className='sidebar-avatar'>{getInitials(user)}</div>
        <div className='sidebar-meta'>
          <p className='sidebar-name mb-1'>
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName || 'Admin User'}
          </p>
          <p className='sidebar-email mb-0 text-muted'>{user?.email}</p>
        </div>
      </div>
      <div className='sidebar-actions d-lg-none'>
        <Button
          variant='secondary'
          className='w-100'
          text={isMenuOpen ? 'Hide Navigation' : 'Show Navigation'}
          onClick={toggleMenu}
        />
      </div>
      <nav className='sidebar-nav'>
        <ul>
          {links.map((link, index) => {
            if (!isProviderAllowed(link, user)) {
              return null;
            }

            const path = buildPath(link);
            const icon = iconMap[link.to] || 'fa-circle';
            const isExternal = link.to && /^https?:/.test(link.to);

            if (isExternal) {
              return (
                <li key={`admin-link-${index}`}>
                  <a href={link.to} target='_blank' rel='noopener noreferrer'>
                    <i className={`fa ${icon}`} aria-hidden='true'></i>
                    <span>{link.name}</span>
                  </a>
                </li>
              );
            }

            return (
              <li key={`admin-link-${index}`}>
                <NavLink
                  to={path}
                  exact={!link.to}
                  activeClassName='active'
                  onClick={handleNavLinkClick}
                >
                  <i className={`fa ${icon}`} aria-hidden='true'></i>
                  <span>{link.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default React.memo(AdminSidebar);
