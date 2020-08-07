import React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';

import { getCachedItems } from '../../utils/General/GqlHelpers';



export function Home() {
  
  console.log(getCachedItems("Log"));
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <h1>Home</h1>
      </PageSection>
    </>
  )
}

export default Home;