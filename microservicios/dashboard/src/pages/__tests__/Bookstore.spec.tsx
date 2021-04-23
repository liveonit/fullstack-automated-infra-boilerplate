import React from "react";

import { MockedProvider } from "@apollo/client/testing";

import {
  GetAuthorsDocument,
  UpdateAuthorDocument,
} from "../../graphql/queries/autogenerate/hooks";

import AuthorsPage from "../Bookstore/Authors";

import { mount, ReactWrapper } from "enzyme";
import { asyncUpdateWrapper } from "../../utils/tests/asyncUpdateWrapper";
import { isArrayEqual } from "../../utils/general/isArrayEqual";

const mocks = [
  {
    request: {
      query: GetAuthorsDocument,
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
  {
    request: {
      query: UpdateAuthorDocument,
      variables: {
        id: 2,
        data: {
          name: "Juan",
          age: 16,
          country: "Unitest",
        },
      },
    },
    result: () => {
      return {
        data: {
          updateAuthor: {
            id: 2,
            name: "Juan",
            age: 16,
            country: "Unitest",
          },
        },
      };
    },
  },
];

describe("Test bookstore", () => {
  let component: ReactWrapper;
  beforeAll(() => {
    component = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthorsPage />
      </MockedProvider>
    );
  });

  describe("test getAuthors", () => {
    it("Render authors page, loading should work correct before and after get authors", async (done) => {
      expect(component.children().text().includes("loading")).toBeTruthy();

      await asyncUpdateWrapper(component);

      setImmediate(() => {
        component.update();
        expect(component.children().text().includes("loading")).toBeFalsy();
        done();
      });
    });

    it("GetAuthors should get correct and pass to table items", async () => {
      const items: any[] = component
        .find("AuthorsPage")
        .find("Table")
        .at(0)
        .prop("items");
      expect(items.length).toBe(3);
      expect(
        isArrayEqual(items, (mocks[0].result().data as any).authors)
      ).toBeTruthy();
    });

    it("Table should render items correct", async () => {
      const tableBody = component
        .find("AuthorsPage")
        .find("Table")
        .find("tbody");
      expect(tableBody.children().length).toEqual(3);
      expect(
        tableBody.children().at(0).find("BodyCell").at(0).text().includes("1")
      ).toBeTruthy();
      expect(
        tableBody
          .children()
          .at(0)
          .find("BodyCell")
          .at(1)
          .text()
          .includes("Mocked Author one")
      ).toBeTruthy();
      expect(
        tableBody.children().at(0).find("BodyCell").at(2).text().includes("11")
      ).toBeTruthy();
      expect(
        tableBody
          .children()
          .at(0)
          .find("BodyCell")
          .at(3)
          .text()
          .includes("United States")
      ).toBeTruthy();

      expect(
        tableBody.children().at(1).find("BodyCell").at(0).text().includes("2")
      ).toBeTruthy();
      expect(
        tableBody
          .children()
          .at(1)
          .find("BodyCell")
          .at(1)
          .text()
          .includes("Mocked Author two")
      ).toBeTruthy();
      expect(
        tableBody.children().at(1).find("BodyCell").at(2).text().includes("22")
      ).toBeTruthy();
      expect(
        tableBody
          .children()
          .at(1)
          .find("BodyCell")
          .at(3)
          .text()
          .includes("Uruguay")
      ).toBeTruthy();

      expect(
        tableBody.children().at(2).find("BodyCell").at(0).text().includes("3")
      ).toBeTruthy();
      expect(
        tableBody
          .children()
          .at(2)
          .find("BodyCell")
          .at(1)
          .text()
          .includes("Mocked Author three")
      ).toBeTruthy();
      expect(
        tableBody.children().at(2).find("BodyCell").at(2).text().includes("33")
      ).toBeTruthy();
      expect(
        tableBody
          .children()
          .at(2)
          .find("BodyCell")
          .at(3)
          .text()
          .includes("Argentina")
      ).toBeTruthy();
    });
  });

  describe("test updateAuthor", () => {
    // TODO: hacer test para update, pero antes hay que hacer los test para le form
    

    it("Update author should update state correct, and pass change to table", async () => {
      const items: any[] = component
        .find("AuthorsPage")
        .find("Table")
        .at(0)
        .prop("items");
      const newAuthors = [ ...(mocks[0].result() as any).data.authors.filter((a: any) => a.id !== mocks[1].request.variables?.id), (mocks[1].result().data as any).updateAuthor]
      expect(
        isArrayEqual(items, newAuthors)
      ).toBeTruthy();
    });
  });
});
