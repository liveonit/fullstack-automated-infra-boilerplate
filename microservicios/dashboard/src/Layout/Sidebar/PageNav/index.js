import React from 'react';

import { Nav, NavList, NavItem, NavVariants } from '@patternfly/react-core';
import { Link } from 'react-router-dom'

export function PageNav({ location }) {

  const pathname = React.useMemo(
    () => location.pathname.replace(`/macSearch/findbymac/`, ''),
    [location.pathname]
  );
  return (
    <Nav aria-label="Nav" theme="dark">
      <NavList variant={NavVariants.simple}>
        <NavItem itemId={0} isActive={pathname === '/'}>
          <Link to="/">Home</Link>
        </NavItem>
        <NavItem itemId={1} isActive={pathname === '/page1'}>
          <Link to="/page1">Page1</Link>
        </NavItem>
        <NavItem itemId={1} isActive={pathname === '/page2'}>
          <Link to="/page2">Page2</Link>
        </NavItem>
        <NavItem itemId={2} isActive={pathname === '/page3'}>
          <Link to="/page3">Page3</Link>
        </NavItem>
        <NavItem itemId={2} isActive={pathname === '/Logs'}>
          <Link to="/Logs">Logs</Link>
        </NavItem>
      </NavList>
    </Nav>
  );
}

export default PageNav;