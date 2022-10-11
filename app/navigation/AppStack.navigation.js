import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";

import { AuthContext } from "../auth/AuthContext";
import AppText from "../components/AppText";

function AppStack(props) {
  const { logout, userToken, userLoggedIn } = useContext(AuthContext);
  console.log(userLoggedIn);
  return (
    <View style={styles.container}>
      <AppText>
        Bonjour{" "}
        {userLoggedIn.firstName.charAt(0).toUpperCase() +
          userLoggedIn.firstName.slice(1)}
      </AppText>
      <AppButton
        title="Logout"
        onPress={() => logout(userToken)}
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
