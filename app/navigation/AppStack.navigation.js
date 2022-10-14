import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import jwt_decode from "jwt-decode";

import { AuthContext } from "../auth/AuthContext";
import AppText from "../components/AppText";

function AppStack(props) {
  const { logout, userAccessToken } = useContext(AuthContext);
  const userInfos = jwt_decode(userAccessToken);
  console.log(userInfos);
  return (
    <View style={styles.container}>
      <AppText>
        Bonjour{" "}
        {userInfos.firstName.charAt(0).toUpperCase() +
          userInfos.firstName.slice(1)}
      </AppText>
      <AppButton
        title="Logout"
        onPress={() => logout(userAccessToken)}
        style={{ width: "90%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppStack;
