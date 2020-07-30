import React from 'react';
import { PageHeader, Brand, Avatar } from '@patternfly/react-core';

import PageToolbar from './PageToolbar'
import logo from './logo.png';
import avatar from './avatar.svg';

interface HeaderProps {
  navToggle: () => void
}

export const Header: React.FC<HeaderProps> = ({navToggle}) => {
  return (
    <PageHeader
      logo={<Brand src={logo} alt="React-GraphQL-Apollo Logo" />}
      headerTools={PageToolbar}
      // avatar={<Avatar src={avatar} alt="Avatar image" />}
      showNavToggle
      onNavToggle={navToggle}
    />
  );
}

export default Header;