import React from "react";
import { useLazyQuery, gql } from "@apollo/client";

const GET_AUTHORS = gql`
  query Authors(
 {
    authors {
        id
        name
        country
        age
      }
    }
`;

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!, $age: Number, $country: String) {
    createAuthor(name: $name, age: $age, country: $country) {
      id
      name
      country
      age
    }
  }
`;

export const withAuthors = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => (props) => {
  const [state, setState] = React.useState<{
    items: any[];
    count: number;
  }>({
    items: [],
    count: 0,
  });

  const onCompleted = (d: any) => {
    setState({
      ...state,
      items: d.authors || [],
      count: d.authors?.length || 0,
    });
  };

  let [getAuthors, { loading }] = useLazyQuery<{ authors: [] }>(GET_AUTHORS, {
    fetchPolicy: "cache-and-network",
    onCompleted,
  });

  let [createAuthor] = useLazyQuery<{ authors: [] }>(CREATE_AUTHOR, {
    fetchPolicy: "cache-and-network",
  });

  const { items, count } = state;
  return (
    <Component
      items={items}
      count={count}
      getAuthors={getAuthors}
      createAuthor={createAuthor}
      loading={loading}
      {...(props as P)}
    />
  );
};
