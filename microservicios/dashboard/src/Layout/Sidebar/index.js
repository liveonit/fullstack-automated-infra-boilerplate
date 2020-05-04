import React from 'react';
import { PageSidebar } from '@patternfly/react-core';

import PageNav from './PageNav';

export function Sidebar({isNavOpen, location}) {
  return (
    <PageSidebar nav={<PageNav location={location} />} theme="dark" isNavOpen={isNavOpen} />
  );
}

export default Sidebar;