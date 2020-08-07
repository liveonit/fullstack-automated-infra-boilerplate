import gql from "graphql-tag";
import { useLazyQuery, useSubscription, OnSubscriptionDataOptions } from "@apollo/client";
import React from "react";
const GET_LOGS = gql`
  query Logs(
    $offset: Float
    $limit: Float
    $timeStart: Float
    $timeEnd: Float
  ) {
    logs(
      offset: $offset
      limit: $limit
      timeStart: $timeStart
      timeEnd: $timeEnd
    ) {
      count
      limit
      offset
      items {
        id
        operation
        operationType
        payload
        unixStartTime
        executionTime
        resultPayload
      }
    }
  }
`;

const LOGS_SUBSCRIPTION = gql`
  subscription {
    logsSubscription {
      id
      operation
      operationType
      payload
      unixStartTime
      executionTime
      resultPayload
    }
  }
`;

export const withLogs = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => (props) => {
  
  const [state, setState] = React.useState<{ items: any[]; count: number, isSubscribe: boolean }>({
    items: [],
    count: 0,
    isSubscribe: true
  });

  const onCompleted = (d: any) => {
    setState({...state, ...d.logs });
  };

  let [getLogs, { loading }] = useLazyQuery<
    { logs: { items: []; count: number; limit: number; offset: number } },
    { timeStart?: number; timeEnd?: number }
  >(GET_LOGS, {
    variables: {
      timeStart: undefined,
      timeEnd: undefined,
    },
    fetchPolicy: "cache-and-network",
    onCompleted,
  });


  const subscribe = () => {
    setState({ ...state, isSubscribe: true});
  }
  
  const unsubscribe = () => {
    setState({ ...state, isSubscribe: false});
  }

  const onSubscriptionData = (options: OnSubscriptionDataOptions<any>) => {
    setState({...state, items: [options.subscriptionData.data.logsSubscription, ...state.items], count: count+1 })
  }

  useSubscription(LOGS_SUBSCRIPTION, { onSubscriptionData, skip: !state.isSubscribe })

  const { items, count } = state;
  return (
    <Component
      items={items}
      count={count}
      getLogs={getLogs}
      loading={loading}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
      {...(props as P)}
    />
  );
};
