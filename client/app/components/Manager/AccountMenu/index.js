/**
 *
 * AccountMenu
 *
 */

import React from 'react';

import { NavLink } from 'react-router-dom';

import Button from '../../Common/Button';

const AccountMenu = props => {
  const { user, isMenuOpen, links, toggleMenu } = props;

  const getAllowedProvider = link => {
    if (!link.provider) return true;

    const userProvider = user.provider ?? '';
    if (!userProvider) return true;

    return link.provider.includes(userProvider);
  };

  const isDesktop =
    typeof window === 'undefined' ? true : window.innerWidth >= 768;
  const menuVisible = isDesktop || isMenuOpen;

  return (
    <div className='panel-sidebar'>
      <Button
        text='Dashboard Menu'
        className={`${isMenuOpen ? 'menu-panel' : 'menu-panel collapse'}`}
        ariaExpanded={menuVisible ? 'true' : 'false'}
        onClick={toggleMenu}
      />
      <h3 className='panel-title'>Account</h3>
      <ul className={`panel-links ${menuVisible ? 'open' : 'collapsed'}`}>
        {links.map(link => {
          const PREFIX = link.prefix ? link.prefix : '';
          const isProviderAllowed = getAllowedProvider(link);
          if (!isProviderAllowed) return null;

          return (
            <li key={`${PREFIX}${link.to}`}>
              <NavLink
                to={PREFIX + link.to}
                activeClassName='active-link'
                exact
              >
                {link.name}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AccountMenu;
