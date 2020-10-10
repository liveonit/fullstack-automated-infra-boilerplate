import React from 'react';
import * as Apollo from '@apollo/client';

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
  get: (baseOptions?: any) => Apollo.QueryResult;
  create?: (baseOptions?: any) => any[];
  update?: (baseOptions?: any) => any[];
  remove?: (baseOptions?: any) => any[];
  subscribe?: (baseOptions?: any) => Apollo.SubscriptionResult;
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
  const { loading } = get({
    onCompleted: (data: any) => {
      const entitiesName = entityName.toLowerCase() + "s";
      if (data && data[entitiesName]) {
        setState({ ...state, items: data[entitiesName] as ({ id: any } & T)[], data });
      }
    }
  });

  const [createItem] = (create && create({
    onCompleted: (data: any) => {
      if (data[`create${entityName}`]) {
        const newItems: ({ id: any } & T)[] = [...state.items, data[`create${entityName}`]];
        setState({ ...state, items: newItems });
      }
    },
  })) || []

  const [updateItem] = (update && update({
    onCompleted: (data: any) => {
      if (data[`update${entityName}`]) {
        const updUser = data[`update${entityName}`];
        const newItems: ({ id: any } & T)[] = state.items.map((i) =>
          i.id !== updUser.id ? i : updUser
        );
        setState({ ...state, items: newItems });
      }
    },
  })) || [];

  const [removeItem] = (remove && remove({
    onCompleted: (data: any) => {
      if (data[`delete${entityName}`]) {
        const delUser = data[`delete${entityName}`];
        const newItems: ({ id: any } & T)[] = state.items.filter((i) => i.id !== delUser);
        setState({ ...state, items: newItems });
      }
    },
  })) || [];

  const result = React.useMemo(() => ({
    createItem,
    updateItem,
    removeItem,
    loading
  }), [createItem, updateItem, removeItem, loading])

  return result;
}