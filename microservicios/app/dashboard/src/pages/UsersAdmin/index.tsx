import React from "react";

import SimpleTabs from "../../components/SimpleTabs/SimpleTabs";
import Roles from "./Roles";
import Users from "./Users";
const UsersAdmin = () => {
  return (
    <>
        <SimpleTabs
          tabObjects={[
            { title: "Users", page: Users },
            { title: "Roles", page: Roles },
          ]}
        />
    </>
  );
}

export default UsersAdmin;