import React from 'react';
import { Nav, NavList, NavItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom'
import { Location, History } from 'history' 

interface Props {
  location: Location
}

export const PageNav: React.FC<Props> = ({ location }) => {

  const pathname = React.useMemo(
    () => location.pathname.replace(`/macSearch/findbymac/`, ''),
    [location.pathname]
  );
  return (
    <Nav aria-label="Nav" theme="dark">
      <NavList>
        <NavItem itemId={0} isActive={pathname === '/'}>
          <Link to="/">Home</Link>
        </NavItem>
        <NavItem itemId={1} isActive={pathname === '/demoGrid'}>
          <Link to="/demogrid">Demo Grid</Link>
        </NavItem>
        <NavItem itemId={2} isActive={pathname === '/page2'}>
          <Link to="/bookstore">Bookstore</Link>
        </NavItem>
        <NavItem itemId={3} isActive={pathname === '/Logs'}>
          <Link to="/bookstoreaudit">Bookstore Audit</Link>
        </NavItem>
        <NavItem itemId={4} isActive={pathname === '/page3'}>
          <Link to="/usersadmin">Users Admin</Link>
        </NavItem>
      </NavList>
    </Nav>
  );
}

export default PageNav;