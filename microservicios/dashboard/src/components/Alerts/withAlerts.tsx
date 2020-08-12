import React from "react";
import { useLazyQuery, useSubscription, OnSubscriptionDataOptions, gql } from "@apollo/client";
const GET_ALERTS = gql`
  query Alerts() {
    alerts () {
      items {
        id
        title
        type
        description
      }
    }
  }
`;

const ALERTS_SUBSCRIPTION = gql`
  subscription {
    alertsSubscription {
      id
      title
      type
      description
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


  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => () => setState({...state, isSubscribe: false}),[])

  const onCompleted = (d: any) => {
    setState({ ...state, ...d.logs });
  };

  let [getAlerts, { loading }] = useLazyQuery<{ alerts: { items: [] }, count: number }>(
    GET_ALERTS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted,
    }
  );

  const onSubscriptionData = (options: OnSubscriptionDataOptions<any>) => {
    setState({
      ...state,
      items: [options.subscriptionData.data.logsSubscription, ...state.items],
      count: state.count + 1,
    });
  };

  useSubscription(ALERTS_SUBSCRIPTION, {
    onSubscriptionData,
    skip: !state.isSubscribe,
  });

  const { items } = state;
  return (
    <Component
      alerts={items}
      getAlerts={getAlerts}
      loading={loading}
      {...(props as P)}
    />
  );
};
