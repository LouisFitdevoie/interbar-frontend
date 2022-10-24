import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";

import { AuthContext } from "../auth/AuthContext";
import AppText from "../components/AppText";
import LoadingIndicator from "../components/LoadingIndicator";
import Screen from "../components/Screen";

function LogoutTestScreen(props) {
  const { logout, isLoading, isTokenExpired, updateAccessToken, user } =
    useContext(AuthContext);

  return (
    <Screen version="scroll">
      <View style={styles.container}>
        <AppText>
          Bonjour{" "}
          {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}
          {`\n`}Access token still valid ? {isTokenExpired() ? "No" : "Yes"}
        </AppText>
        <AppButton
          title="Update access token"
          onPress={updateAccessToken}
          style={{ width: "90%" }}
        />
        <AppButton
          title="Logout"
          onPress={() => logout()}
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
