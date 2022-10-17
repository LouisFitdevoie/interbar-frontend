import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";
import jwt_decode from "jwt-decode";

import { AuthContext } from "../auth/AuthContext";
import AppText from "../components/AppText";
import LoadingIndicator from "../components/LoadingIndicator";
import Screen from "../components/Screen";

function LogoutTestScreen(props) {
  const { logout, isLoading, userAccessToken, userRefreshToken } =
    useContext(AuthContext);
  const userInfos = jwt_decode(userAccessToken);
  return (
    <Screen version="scroll">
      <View style={styles.container}>
        <AppText>
          Bonjour{" "}
          {userInfos.firstName.charAt(0).toUpperCase() +
            userInfos.firstName.slice(1)}
        </AppText>
        <AppButton
          title="Logout"
          onPress={() => logout(userRefreshToken)}
          style={{ width: "90%" }}
        />
        {isLoading && <LoadingIndicator />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LogoutTestScreen;
