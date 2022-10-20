import React, { useContext } from "react";
import jwtDecode from "jwt-decode";

import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import { AuthContext } from "../auth/AuthContext";

function AccountScreen(props) {
  const { userAccessToken } = useContext(AuthContext);
  const user = jwtDecode(userAccessToken);
  return (
    <Screen>
      <ListItem
        title={`${user.firstName} ${user.lastName}`}
        subtitle={user.emailAddress}
        onPress={console.log("ok")}
      />
    </Screen>
  );
}

export default AccountScreen;
