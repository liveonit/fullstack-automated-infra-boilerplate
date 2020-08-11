import React from "react";
import {
  useLazyQuery,
  useSubscription,
  OnSubscriptionDataOptions,
  DocumentNode,
  useMutation
} from "@apollo/client";

import { Subtract } from 'utility-types';

interface InjectedGqlHoCProps {
  items: any[];
  count: number;
  loading: boolean;
  get?: Function,
  create?: Function,
  update?: Function,
  remove?: Function,
  subscribe?: Function,
  unsubscribe?: Function
}

interface HoCConfig {
  entityName: string;
  subscriptionGql?: DocumentNode;
  readGql?: DocumentNode;
  createGql?: DocumentNode;
  updateGql?: DocumentNode;
  removeGql?: DocumentNode;
}

export const gqlHoC = (config: HoCConfig) => <P extends InjectedGqlHoCProps>(
  Component: React.ComponentType<P>
): React.FC<Subtract<P,InjectedGqlHoCProps>> => (props) => {
  const {
    entityName,
    subscriptionGql,
    readGql,
    createGql,
    updateGql,
    removeGql,
  } = config;
  const [state, setState] = React.useState<{
    items: any[];
    count: number;
    isSubscribe: boolean;
  }>({
    items: [],
    count: 0,
    isSubscribe: false,
  });

  const entities = entityName.toLowerCase() + "s";
  
  
  // =======================
  // Read from GQL API
  // =======================
  let get, loading;
  if (readGql !== undefined) {
    const onCompletedQuery = (d: any) => {
      console.log(d)
      let c = 0;
      const items = (d[entities]?.items || []).map((i: any) => ({ key: c++, ...i}))
      const count = d[entities]?.count
      setState({ ...state, items, count });
    };

    [get, { loading }] = useLazyQuery(readGql, {
      fetchPolicy: "cache-and-network",
      onCompleted: onCompletedQuery,
    });
  }

  let subscribe, unsubscribe, onSubscriptionData;
  if (subscriptionGql) {
    subscribe = () => {
      setState({ ...state, isSubscribe: true });
    };

    unsubscribe = () => {
      setState({ ...state, isSubscribe: false });
    };

    onSubscriptionData = (options: OnSubscriptionDataOptions<any>) => {
      setState({
        ...state,
        items: [
          options.subscriptionData.data[entities + "Subscription"],
          ...state.items,
        ],
        count: count + 1,
      });
    };
    useSubscription(subscriptionGql, {
      onSubscriptionData,
      skip: !state.isSubscribe,
    });
  }

  let create;
  if (createGql) {
    const onCompletedCreate = (data: any) => {
      console.log("createData", data);
      setState({ ...state, items: [...state.items, data] });
    };
    [create] = useMutation(createGql, {
      onCompleted: onCompletedCreate,
    });
  }

  let update;
  if (updateGql) {
    const onCompletedUpdate = (data: any) => {
      console.log("updateData", data);
      setState({ ...state, items: [...state.items, data] });
    };
    [update] = useMutation(updateGql, {
      onCompleted: onCompletedUpdate,
    });
  }

  let remove;
  if (removeGql) {
    const onCompletedRemove = (data: any) => {
      console.log("deleteData", data);
      setState({ ...state, items: [...state.items.filter(i => i.id !== data.id) ] });
    };
    [remove] = useMutation(removeGql, {
      onCompleted: onCompletedRemove,
    });
  }

  const { items, count } = state;

  return (
    <Component
      {...(props as P)}
      items={items}
      count={count}
      get={get || (() => console.log(`Can't execute "get" because isn't defined`))}
      create={create  || (() => console.log(`Can't execute "create" because isn't defined`))}
      update={update || (() => console.log(`Can't execute "update" because isn't defined`))}
      remove={remove || (() => console.log(`Can't execute "remove" because isn't defined`))}
      loading={loading}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
    />
  );
};

export default gqlHoC