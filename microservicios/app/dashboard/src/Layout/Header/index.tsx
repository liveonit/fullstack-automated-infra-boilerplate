import React from "react";
import { PageHeader, Brand } from "@patternfly/react-core";

import PageToolbar from "./PageToolbar";
import logo from "./logo.png";

interface HeaderProps {
  navToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ navToggle }) => (
  <PageHeader
    logo={<Brand src={logo} alt="React-GraphQL-Apollo Logo" />}
    headerTools={<PageToolbar />}
    showNavToggle
    onNavToggle={navToggle}
  />
);

export default Header;
