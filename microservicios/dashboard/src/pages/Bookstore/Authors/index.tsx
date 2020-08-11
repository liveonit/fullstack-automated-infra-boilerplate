import React from "react";
import { Spinner, Button } from "@patternfly/react-core";

import Table from "./Table";
import Fuse from "fuse.js";
import { HeaderToolbar } from "../../../components/Tables/HeaderToolbar";
import { FooterToolbar } from "../../../components/Tables/FooterToolbar";
import { gql } from "@apollo/client";

import { gqlHoC } from "../../../utils/General/GqlHoC";

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100];
const FUSE_OPTIONS = {
  keys: ["name", "age", "country"],
};
interface AuthorsPageProps {
  get: () => void;
  create: ({
    variables: { name, age, country },
  }: {
    variables: { name: String; age?: number; country?: String };
  }) => void;
  update: ({
    variables: { id, name, age, country },
  }: {
    variables: { id: number; name?: String; age?: number; country?: String };
  }) => void;
  remove: ({
    variables: { id },
  }: {
    variables: { id: number; };
  }) => void;
  loading: boolean;
  items: any[];
  count: number;
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({
  get,
  create,
  update,
  remove,
  loading,
  items,
  count,
}) => {
  const [state, setState] = React.useState({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    searchText: "",
  });
  const { currentPage, pageLimit } = state;

  React.useEffect(() => {
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPageLimitChanged = (n: number) => {
    setState({
      ...state,
      pageLimit: n,
      currentPage: 1,
    });
  };

  const onPageChanged = (page: number) => {
    setState({ ...state, currentPage: page });
  };

  const handleUpdateFilterInput = (searchText?: string) =>
    setState({ ...state, searchText: searchText || "" });

  const offset = (currentPage - 1) * pageLimit;

  const fuse = new Fuse(items, FUSE_OPTIONS);
  const tableItems = state.searchText
    ? fuse
        .search(state.searchText)
        .map((m) => m.item)
        .slice(offset, offset + pageLimit)
    : items.slice(offset, offset + pageLimit);

  return (
    <>
      <HeaderToolbar
        hasFilter={true}
        hasDateTimeFilter={false}
        handleUpdateFilterInput={handleUpdateFilterInput}
      />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Button
            onClick={() =>
              create({
                variables: {
                  name: "ibarreto",
                  age: 123,
                  country: "tres cruces",
                },
              })
            }
          ></Button>
          <Button
            onClick={() =>
              update({
                variables: {
                  id: 11,
                  name: "ibarretoupd",
                  age: 12357,
                  country: "tres crucesupd",
                },
              })
            }
          ></Button>
          <Button onClick={() => remove({ variables: { id: 7 } })}></Button>
          <Table items={tableItems} />
          <div className="pagination-footer">
            <FooterToolbar
              totalRecords={count}
              pageLimit={pageLimit}
              currentPage={currentPage}
              posibleLimitsPerPage={POSIBLE_LIMITS_PER_PAGE}
              onPageLimitChanged={onPageLimitChanged}
              onPageChanged={onPageChanged}
            />
          </div>
        </>
      )}
    </>
  );
};

const GET_AUTHORS = gql`
  query Authors {
    authors {
      count
      limit
      offset
      items {
        id
        name
        country
        age
      }
    }
  }
`;

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!, $age: Float!, $country: String) {
    createAuthor(data: { name: $name, age: $age, country: $country }) {
      id
      name
      country
      age
    }
  }
`;

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor(
    $id: Float!
    $age: Float
    $country: String
    $name: String
  ) {
    updateAuthor(id: $id, data: { age: $age, country: $country, name: $name }) {
      age
      country
      id
      name
    }
  }
`;

const REMOVE_AUTHOR = gql`
  mutation RemoveAuthor($id: Float!) {
    deleteAuthor(id: $id)
  }
`;
export default gqlHoC({
  entityName: "Author",
  readGql: GET_AUTHORS,
  createGql: CREATE_AUTHOR,
  updateGql: UPDATE_AUTHOR,
  removeGql: REMOVE_AUTHOR,
})(AuthorsPage);
