/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import * as Apollo from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import _ from 'lodash';

export type GqlTypes = "Int" | "Float" | "String" | "Boolean" | "ID" | "[String!]"

export interface EntityProp {
  name: string;
  type: GqlTypes;
  required: boolean;
}


export interface HookDetails {
  name: string;
}

export interface UseEntityArgs<T> {
  entityName: string;
  onChange: (result: State<T>) => void;
  get: Apollo.DocumentNode;
  create?: Apollo.DocumentNode;
  update?: Apollo.DocumentNode;
  remove?: Apollo.DocumentNode;
  subscribe?: Apollo.DocumentNode;
}

interface State<T> {
  items: ({ id: any } & T)[];
  data?: any;
}

export const useEntity = <T>({ entityName, get, create, update, remove, subscribe, onChange }: UseEntityArgs<T>) => {
  const [state, setState] = React.useState<State<T>>({ items: [] })

  React.useEffect(() => {
    onChange(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const { loading } = useQuery(get, {
    onCompleted: (data: any) => {
      const entitiesName = entityName.toLowerCase() + "s";
      const items: ({ id: any } & T)[] = data[entitiesName]
      if (data && items) {
        setState({ ...state, items, data:_.omit(data, [entitiesName])  });
      }
    },
    fetchPolicy: "cache-first"
  });

  const [createItem] = (create && useMutation(create, {
    onCompleted: (data: any) => {
      if (data[`create${entityName}`]) {
        const newItems: ({ id: any } & T)[] = [...state.items, data[`create${entityName}`]];
        setState({ ...state, items: newItems });
      }
    },
    update: (cache, { data }) => {
      if (get) {
        const result: any = cache.readQuery({ query: get });
        const newItems: ({ id: any } & T)[] = [...state.items, data[`create${entityName}`]];
        const newResult = {
          ...result,
          [`${entityName.toLowerCase()}s`]: newItems
        }
        cache.writeQuery({
          query: get,
          data: newResult
        });
      }
    }
  })) || []

  const [updateItem] = (update && useMutation(update, {
    onCompleted: (data: any) => {
      if (data[`update${entityName}`]) {
        const updUser = data[`update${entityName}`];
        const newItems: ({ id: any } & T)[] = state.items.map((i) =>
          i.id !== updUser.id ? i : updUser
        );
        setState({ ...state, items: newItems });
      }
    }
  })) || [];

  const [removeItem] = (remove && useMutation(remove, {
    onCompleted: (data: any) => {
      if (data[`delete${entityName}`]) {
        const delUser = data[`delete${entityName}`];
        const newItems: ({ id: any } & T)[] = state.items.filter((i) => i.id !== delUser);
        setState({ ...state, items: newItems });
      }
    },
    update: (cache, { data }) => {
      cache.modify({
        fields: {
          [`${entityName.toLowerCase()}s`]: (
            exsistingItems,
            { readField }
          ) => {
            const newItems = exsistingItems.filter(
              (i: any) => data[`delete${entityName}`] !== readField("id", i)
            );
            return newItems;
          },
        },
      });
    }
  })) || [];

  return {
    createItem,
    updateItem,
    removeItem,
    loading
  };
}