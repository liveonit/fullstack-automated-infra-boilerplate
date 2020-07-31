import React from "react";
import { PageSection } from "@patternfly/react-core";

import SimpleTabs from "../../components/SimpleTabs/SimpleTabs";
import Books from "./Books";
import Authors from "./Authors";

export function BookStore() {
  return (
    <>
      <PageSection>
        <SimpleTabs
          tabObjects={[
            { title: "Authors", page: <Authors /> },
            { title: "Books", page: <Books /> },
          ]}
        />
      </PageSection>
    </>
  );
}

export default BookStore;
