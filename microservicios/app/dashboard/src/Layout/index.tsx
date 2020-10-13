import './style.css'
import "@patternfly/react-core/dist/styles/base.css";

import React from 'react';
import { 
  Page,
  PageSection,
  PageSectionVariants,
  SkipToContent
} from '@patternfly/react-core';

import Header from './Header';
import Sidebar from './Sidebar';
// import Breadcrumb from './Breadcrumb';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactChild
}

export const Layout: React.FC<LayoutProps & RouteComponentProps> = ({children, location}) => {
  const [ isNavOpen, setIsNavOpen] = React.useState(false);
  const pageId = 'main-content-page-layout-default-nav';
  const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>;
  
  return (
    <Page
      header={<Header navToggle={ () => setIsNavOpen(!isNavOpen)} />}
      sidebar={<Sidebar isNavOpen={isNavOpen} location={location}/>}
      // breadcrumb={PageBreadcrumb}
      skipToContent={PageSkipToContent}
      isManagedSidebar={false}
    >
      <>
      <PageSection variant={PageSectionVariants.light} className="--seccion-principal">
        {children}
      </PageSection>
      
      </>
    </Page>
  ) 
}

export default withRouter(Layout);