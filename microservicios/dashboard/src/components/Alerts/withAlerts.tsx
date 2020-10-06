import React from "react";
import {
  useLazyQuery,
  useSubscription,
  OnSubscriptionDataOptions,
  gql,
} from "@apollo/client";
import {
  getCachedItems,
} from "../../utils/General/GqlHelpers";
import { Subtract } from "utility-types";

interface InjectedgqlHoCProps {
  alerts: any[];
  hideAlert: (s: string) => void;
}

export const withAlterts = <P extends InjectedgqlHoCProps>(
  Component: React.ComponentType<P>
): React.FC<Subtract<P, InjectedgqlHoCProps>> => (props) => {
  const [state, setState] = React.useState<{
    alarms: any[];
    count: number;
  }>({
    alarms: [],
    count: 0,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  
  // React.useEffect(
  //   () => () =>
  //     setState({
  //       alarms: [].map((se: any) => ({
  //         title: "System Error",
  //         type: "System Error",
  //         description: JSON.stringify({
  //           location: se?.location,
  //           path: se?.path,
  //           message: se.message,
  //         }),
  //       })),
  //       count: getCachedItems("SystemError").length,
  //     }),
  //   []
  // );

  const hideAlert = (description: string) => {
    const data = JSON.parse(description);
    console.info("data to hide alert", data);
  };
  return (
    <Component {...(props as P)} alerts={state.alarms} hideAlert={hideAlert} />
  );
};
