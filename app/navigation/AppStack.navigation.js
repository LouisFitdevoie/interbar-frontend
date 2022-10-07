import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "../components/AppButton";

import { AuthContext } from "../auth/AuthContext";

function AppStack(props) {
  const { logout } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <AppButton
        title="Logout"
        onPress={() => logout()}
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
