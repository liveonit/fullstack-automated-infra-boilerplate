import React from "react";
import {
  useLazyQuery,
  useSubscription,
  OnSubscriptionDataOptions,
  DocumentNode,
  useMutation
} from "@apollo/client";

import { Subtract } from "utility-types";

interface InjectedGqlHoCProps {
  items: any[];
  count: number;
  loading: boolean;
  get?: Function;
  create?: Function;
  update?: Function;
  remove?: Function;
  subscribe?: Function;
  unsubscribe?: Function;
}

interface HoCConfig {
  entityName: string;
  subscriptionGql?: DocumentNode;
  readGql?: DocumentNode;
  createGql?: DocumentNode;
  updateGql?: DocumentNode;
  removeGql?: DocumentNode;
}

export const gqlHoC = <T extends { id: any }>(config: HoCConfig) => <
  P extends InjectedGqlHoCProps
>(
  Component: React.ComponentType<P>
): React.FC<Subtract<P, InjectedGqlHoCProps>> => (props) => {
  const {
    entityName,
    subscriptionGql,
    readGql,
    createGql,
    updateGql,
    removeGql,
  } = config;

  const [state, setState] = React.useState<{
    items: T[];
    count: number;
    isSubscribe: boolean;
  }>({
    items: [],
    count: 0,
    isSubscribe: false,
  });
  const entities = entityName.toLowerCase() + "s";
  const { items, count } = state;

  // =======================
  // Read from GQL API
  // =======================
  let get, loading = false;
  if (readGql !== undefined) {
    const onCompletedQuery = (d: any) => {
      setState({
        ...state,
        items: d[entities] || [],
        count: d[entities]?.length || 0,
      });
    };

    [get, { loading }] = useLazyQuery(readGql, {
      fetchPolicy: "cache-and-network",
      onCompleted: onCompletedQuery,
      onError: (err) => console.error(err),
    });
  }

  // =======================
  // Subscribe to GQL API
  // =======================
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

  // =======================
  // Create item in GQL API
  // =======================
  let create;
  if (createGql) {
    const onCompletedCreate = (data: any) => {
      setState({
        ...state,
        items: [
          ...state.items,
          data[
            "create" +
              entityName.charAt(0).toUpperCase() +
              entityName.slice(1).toLowerCase()
          ],
        ],
      });
    };
    [create] = useMutation(createGql, {
      onCompleted: onCompletedCreate,
      onError: (err) => console.error(err),
      update: (cache, { data }) => {
        if (readGql) {
          const result: any = cache.readQuery({ query: readGql });
          const newItems = [ ...(result[`${entityName.toLowerCase()}s`]), data[`create${entityName}`] ]
          cache.writeQuery({
            query: readGql,
            data: {
              [`${entityName.toLowerCase()}s`]: newItems
            },
          });
        }
      },
    });
  }

  // =======================
  // Update item in GQL API
  // =======================
  let update;
  if (updateGql) {
    const onCompletedUpdate = (data: any) => {
      setState({
        ...state,
        items: state.items.map((i) => (i === data.id ? data : i)),
      });
    };
    [update] = useMutation(updateGql, {
      onCompleted: onCompletedUpdate,
      onError: (err) => console.error(err),
    });
  }

  // =======================
  // Remove item in GQL API
  // =======================
  let remove;
  if (removeGql) {
    const onCompletedRemove = (data: any) => {
      let respId =
        data[
          "delete" +
            entityName.charAt(0).toUpperCase() +
            entityName.slice(1).toLowerCase()
        ];
      let comparable = isNaN(respId) ? respId : parseInt(respId);
      let newItemsState = items.filter((i) => i.id !== comparable);
      setState({
        ...state,
        items: newItemsState,
      });
    };
    [remove] = useMutation(removeGql, {
      onCompleted: onCompletedRemove,
      onError: (err) => console.error(err),
      update: (cache, { data }) => {
        cache.modify({
          fields: {
            [`${entityName.toLowerCase()}s`]: (exsistingItems, { readField }) => {
              const newItems = exsistingItems.filter(
                (i: any) => data[`delete${entityName}`] !== readField('id', i),
              );
              return newItems
            },
          },
        });
      },
    });
  }

  return (
    <Component
      {...(props as P)}
      items={items}
      count={count}
      get={
        get || (() => console.log(`Can't execute "get" because isn't defined`))
      }
      create={
        create ||
        (() => console.log(`Can't execute "create" because isn't defined`))
      }
      update={
        update ||
        (() => console.log(`Can't execute "update" because isn't defined`))
      }
      remove={
        remove ||
        (() => console.log(`Can't execute "remove" because isn't defined`))
      }
      loading={loading}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
    />
  );
};
export default gqlHoC;
