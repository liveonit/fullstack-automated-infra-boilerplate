import React from 'react';
import { 
  Page,
  PageSection,
  PageSectionVariants
} from '@patternfly/react-core';

import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Breadcrumb from '../components/Layout/Breadcrumb';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactChild
}

export const Layout: React.FC<LayoutProps & RouteComponentProps> = ({children, location}) => {
  const [ isNavOpen, setIsNavOpen] = React.useState(false);
  return (
    <Page
      header={<Header navToggle={ () => setIsNavOpen(!isNavOpen)} />}
      sidebar={<Sidebar isNavOpen={isNavOpen} location={location}/>}
      isManagedSidebar={false}
    >
      <>
      <PageSection variant={PageSectionVariants.darker}>
        <Breadcrumb location={location}/>
      </PageSection>
      {children}
      </>
    </Page>
  ) 
}

export default withRouter(Layout);