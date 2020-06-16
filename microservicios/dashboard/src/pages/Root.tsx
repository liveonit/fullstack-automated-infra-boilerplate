import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../utils/General/history";

import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "../utils/General/GqlClient";
import Layout from "../Layout";
import Home from "./Home";
import DemoGrid from "./DemoGrid";
import Page2 from "./Page2";
import Page3 from "./Page3";
import LogsPage from './Logs'

export function Root() {
  return (
    <ApolloProvider client={client}>
      <Router history={history}>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/demoGrid" component={DemoGrid} />
            <Route path="/page2" component={Page2} />
            <Route path="/page3" component={Page3} />
            <Route path="/logs" component={LogsPage} />
          </Switch>
        </Layout>
      </Router>
    </ApolloProvider>
  );
}

export default Root;
