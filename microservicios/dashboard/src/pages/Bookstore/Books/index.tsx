import React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';

const Books: React.FC = () =>  {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <h1>Books</h1>
      </PageSection>
    </>
  )
}

export default Books;