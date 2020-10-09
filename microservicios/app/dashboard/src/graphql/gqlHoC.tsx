import React from "react";
import {
  useSubscription,
  OnSubscriptionDataOptions,
  DocumentNode,
  useMutation,
  useQuery,
} from "@apollo/client";

import { Subtract } from "utility-types";
import _ from "lodash";

interface InjectedgqlHoCProps {
  items: any[];
  count: number;
  loading: boolean;
  get: Function;
  create?: Function;
  update?: Function;
  remove?: Function;
  subscribe?: Function;
  unsubscribe?: Function;
}

interface HoCConfig {
  entityName: string;
  subscriptionGql?: DocumentNode;
  readGql: DocumentNode;
  createGql?: DocumentNode;
  updateGql?: DocumentNode;
  removeGql?: DocumentNode;
}

export const gqlHoC = <T extends { id: any }>(config: HoCConfig) => <
  P extends InjectedgqlHoCProps
>(
  Component: React.ComponentType<P>
): React.FC<Subtract<P, InjectedgqlHoCProps>> => (props) => {
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

  const entities = React.useMemo(() => entityName.toLowerCase() + "s", [
    entityName,
  ]);

  // =======================
  // Read from GQL API
  // =======================
  const onCompletedQuery = (d: any) => {
    const newItems = d[entities];
    if (!_.isEqual(state.items, newItems))
      setState({
        ...state,
        items: d[entities] || [],
        count: d[entities]?.length || 0,
      });
  };

  const { refetch, loading } = useQuery(readGql, {
    onCompleted: onCompletedQuery,
    onError: (err) => console.error(err),
  });

  // =======================
  // Subscribe to GQL API
  // =======================
  let onSubscriptionData;
  const subscribe = React.useMemo(() => () => {
    setState({ ...state, isSubscribe: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unsubscribe = React.useMemo(() => () => {
    setState({ ...state, isSubscribe: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  onSubscriptionData = (options: OnSubscriptionDataOptions<any>) => {
    setState({
      ...state,
      items: [
        options.subscriptionData.data[entities + "Subscription"],
        ...state.items,
      ],
      count: state.count + 1,
    });
  };
  subscriptionGql &&
    useSubscription(subscriptionGql, {
      onSubscriptionData,
      skip: !state.isSubscribe,
    });

  // =======================
  // Create item in GQL API
  // =======================

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
  const [create] =
    (createGql &&
      useMutation(createGql, {
        onCompleted: onCompletedCreate,
        onError: (err) => console.error(err),
        update: (cache, { data }) => {
          if (readGql) {
            const result: any = cache.readQuery({ query: readGql });
            const newItems = [
              ...result[`${entityName.toLowerCase()}s`],
              data[`create${entityName}`],
            ];
            cache.writeQuery({
              query: readGql,
              data: {
                [`${entityName.toLowerCase()}s`]: newItems,
              },
            });
          }
        },
      })) ||
    [];

  // =======================
  // Update item in GQL API
  // =======================
  const onCompletedUpdate = (data: any) => {
    setState({
      ...state,
      items: state.items.map((i) => (i === data.id ? data : i)),
    });
  };
  const [update] =
    (updateGql &&
      useMutation(updateGql, {
        onCompleted: onCompletedUpdate,
        onError: (err) => console.error(err),
      })) ||
    [];

  // =======================
  // Remove item in GQL API
  // =======================

  const onCompletedRemove = (data: any) => {
    let respId =
      data[
        "delete" +
          entityName.charAt(0).toUpperCase() +
          entityName.slice(1).toLowerCase()
      ];
    let comparable = isNaN(respId) ? respId : parseInt(respId);
    let newItemsState = state.items.filter((i) => i.id !== comparable);
    setState({
      ...state,
      items: newItemsState,
    });
  };
  const [remove] =
    (removeGql &&
      useMutation(removeGql, {
        onCompleted: onCompletedRemove,
        onError: (err) => console.error(err),
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
        },
      })) ||
    [];

  return (
    <Component
      {...(props as P)}
      items={state.items}
      count={state.count}
      get={refetch}
      {...(create && { create })}
      {...(remove && { remove })}
      {...(update && { update })}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
      loading={loading}
    />
  );
};

export default gqlHoC;
