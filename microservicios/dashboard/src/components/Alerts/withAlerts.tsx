import gql from "graphql-tag";
import { useLazyQuery, useSubscription } from "@apollo/react-hooks";
import React from "react";
import { OnSubscriptionDataOptions } from "@apollo/react-common";
const GET_LOGS = gql`
  query Alerts() {
    alerts () {
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

export const withAlterts = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => (props) => {
  const [state, setState] = React.useState<{
    items: any[];
    count: number;
    isSubscribe: boolean;
  }>({
    items: [],
    count: 0,
    isSubscribe: true,
  });

  const onCompleted = (d: any) => {
    setState({ ...state, ...d.logs });
  };

  let [getAlerts, { loading }] = useLazyQuery<{ alerts: { items: [] } }>(
    GET_LOGS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted,
    }
  );

  const subscribe = () => {
    setState({ ...state, isSubscribe: true });
  };

  const unsubscribe = () => {
    setState({ ...state, isSubscribe: false });
  };

  const onSubscriptionData = (options: OnSubscriptionDataOptions<any>) => {
    setState({
      ...state,
      items: [options.subscriptionData.data.logsSubscription, ...state.items],
      count: count + 1,
    });
  };

  useSubscription(LOGS_SUBSCRIPTION, {
    onSubscriptionData,
    skip: !state.isSubscribe,
  });

  const { alerts } = state;
  return (
    <Component
      alerts={alerts}
      getAlerts={getAlerts}
      loading={loading}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
      {...(props as P)}
    />
  );
};
