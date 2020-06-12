import React from 'react';
import { 
  Page,
  PageSection,
  PageSectionVariants
} from '@patternfly/react-core';

import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactChild
}

export const Layout: React.FC<LayoutProps & RouteComponentProps> = ({children, location}) => {
  const [ isNavOpen, setIsNavOpen] = React.useState(true);
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