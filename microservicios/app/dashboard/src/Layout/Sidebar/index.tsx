import React from 'react';
import { PageSidebar } from '@patternfly/react-core';

import { Location, History } from 'history' 
import PageNav from './PageNav';
interface Props  {
  isNavOpen: boolean,
  location: Location
}

const Sidebar: React.FC<Props> = ({isNavOpen, location}) => {
  return (
    <PageSidebar nav={<PageNav location={location} />} theme="dark" isNavOpen={isNavOpen} />
  );
}

export default Sidebar;