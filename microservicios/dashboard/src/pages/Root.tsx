import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../utils/General/history";

import Keycloak from "../components/Keycloak/Initializate";
import { ApolloProvider } from "@apollo/client";
import { client } from "../utils/General/GqlClient";
import Layout from "../Layout";
import Home from "./Home";
import DemoGrid from "./DemoGrid";
import Bookstore from "./Bookstore";
import UsersAdmin from "./UsersAdmin";
import LogsPage from "./BookstoreAudit";

const  Root: React.FC = () => {
  return (
    <Keycloak>
      <ApolloProvider client={client}>
        <Router history={history}>
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/demogrid" component={DemoGrid} />
              <Route path="/bookstore" component={Bookstore} />
              <Route path="/usersadmin" component={UsersAdmin} />
              <Route path="/bookstoreaudit" component={LogsPage} />
            </Switch>
          </Layout>
        </Router>
      </ApolloProvider>
    </Keycloak>
  );
}

export default Root;
