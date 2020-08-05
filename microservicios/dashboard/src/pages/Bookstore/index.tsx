import React from "react";

import SimpleTabs from "../../components/SimpleTabs/SimpleTabs";
import Books from "./Books";
import Authors from "./Authors";

export function BookStore() {
  return (
    <>
        <SimpleTabs
          tabObjects={[
            { title: "Authors", page: <Authors /> },
            { title: "Books", page: <Books /> },
          ]}
        />
    </>
  );
}

export default BookStore;
