import React from "react";

import { MockedProvider } from "@apollo/client/testing";

import { GetAuthorsDocument } from "../../graphql/queries/autogenerate/hooks";

import AuthorsPage from "../Bookstore/Authors";
import { act, wait } from "@testing-library/react";
import render from "react-test-renderer";
import { mount, ReactWrapper, shallow } from "enzyme";
import { count } from "console";
import { asyncUpdateWrapper } from "../../utils/tests/asyncUpdateWrapper";

const mocks = [
  {
    request: {
      query: GetAuthorsDocument,
      // variables: {
      //   name: 'Buck',
      // },
    },
    result: () => {
      return {
        data: {
          authors: [
            {
              id: 1,
              name: "Mocked Author one",
              age: 11,
              country: "United States",
            },
            { id: 2, name: "Mocked Author two", age: 22, country: "Uruguay" },
            {
              id: 3,
              name: "Mocked Author three",
              age: 33,
              country: "Argentina",
            },
          ],
        },
      };
    },
  },
];

describe("Bookstore, test getAuthors", () => {
  let component: ReactWrapper;
  beforeAll(() => {
    component = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthorsPage />
      </MockedProvider>
    );
  });

  it("Render authors page, loading should work correct before and after get authors", async (done) => {
    expect(component.children().text().includes("loading")).toBeTruthy();

    await asyncUpdateWrapper(component);

    setImmediate(() => {
      component.update();
      expect(component.children().text().includes("loading")).toBeFalsy();
      done();
    });
  });

  it("Render authors page, authors should get correct and pass to table items", async () => {
    const items: any[] = component.find("AuthorsPage").find("Table").at(0).prop('items')
    expect(items.length).toBe(3)
  });
});
