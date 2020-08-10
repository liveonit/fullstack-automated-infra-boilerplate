import React from "react";
import {
  useLazyQuery,
  useSubscription,
  OnSubscriptionDataOptions,
  DocumentNode,
  useMutation,
} from "@apollo/client";

import { Subtract } from 'utility-types';

interface InjectedGqlHoCProps {
  items: any[];
  count: number;
  loading: boolean;
}

interface MethodConfig {
  enable: boolean;
  gql: DocumentNode;
  variables?: any;
}

interface HoCConfig {
  entityName: string;
  subscriptionConf?: MethodConfig;
  readConf?: MethodConfig;
  createConf?: MethodConfig;
  updateConf?: MethodConfig;
  removeConf?: MethodConfig;
}

export const withLogs = (config: HoCConfig) => <P extends InjectedGqlHoCProps>(
  Component: React.ComponentType<P>
): React.FC<Subtract<P,InjectedGqlHoCProps>> => (props) => {
  const {
    entityName,
    subscriptionConf,
    readConf,
    createConf,
    updateConf,
    removeConf,
  } = config;
  const [state, setState] = React.useState<{
    items: any[];
    count: number;
    isSubscribe: boolean;
  }>({
    items: [],
    count: 0,
    isSubscribe: true,
  });

  const entities = entityName.toLowerCase() + "s";
  // =======================
  // Read from GQL API
  // =======================
  let get, loading;
  if (readConf && readConf.enable && readConf?.gql) {
    const onCompletedQuery = (d: any) => {
      setState({ ...state, ...d[entities] });
    };

    [get, { loading }] = useLazyQuery(readConf?.gql, {
      variables: readConf?.variables,
      fetchPolicy: "cache-and-network",
      onCompleted: onCompletedQuery,
    });
  }

  let subscribe, unsubscribe, onSubscriptionData;
  if (subscriptionConf && subscriptionConf.enable && subscriptionConf?.gql) {
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
    useSubscription(subscriptionConf.gql, {
      onSubscriptionData,
      skip: !state.isSubscribe,
    });
  }

  let create;
  if (createConf && createConf.enable && createConf?.gql) {
    const onCompletedCreate = (data: any) => {
      console.log("createData", data);
      setState({ ...state, items: [...state.items, data] });
    };
    [create] = useMutation(createConf.gql, {
      variables: createConf?.variables,
      onCompleted: onCompletedCreate,
    });
  }

  let update;
  if (updateConf && updateConf.enable && updateConf?.gql) {
    const onCompletedUpdate = (data: any) => {
      console.log("updateData", data);
      setState({ ...state, items: [...state.items, data] });
    };
    [update] = useMutation(updateConf.gql, {
      variables: updateConf?.variables,
      onCompleted: onCompletedUpdate,
    });
  }

  let remove;
  if (removeConf && removeConf.enable && removeConf?.gql) {
    const onCompletedRemove = (data: any) => {
      console.log("deleteData", data);
      setState({ ...state, items: [...state.items.filter(i => i.id !== data.id) ] });
    };
    [remove] = useMutation(removeConf.gql, {
      variables: removeConf?.variables,
      onCompleted: onCompletedRemove,
    });
  }

  const { items, count } = state;
  return (
    <Component
      {...(props as P)}
      items={items}
      count={count}
      get={get}
      create={create}
      update={update}
      remove={remove}
      loading={loading}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
    />
  );
};
