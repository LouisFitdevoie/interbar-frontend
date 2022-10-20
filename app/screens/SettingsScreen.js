import React, { useContext } from "react";
import jwtDecode from "jwt-decode";
import { FlatList, StyleSheet, View } from "react-native";

import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import { AuthContext } from "../auth/AuthContext";
import ListIcon from "../components/lists/ListIcon";
import colors from "../config/colors";

const settingsItems = [
  {
    title: "Modifier mes données personnelles",
    icon: {
      name: "card-account-details-outline",
      backgroundColor: colors.green,
    },
  },
  {
    title: "Modifier mon mot de passe",
    icon: {
      name: "key-variant",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "Utilisation des données personnelles",
    icon: {
      name: "information-outline",
      backgroundColor: colors.blue,
    },
  },
  {
    title: "Déconnexion",
    icon: {
      name: "logout",
      backgroundColor: colors.danger,
    },
  },
];

function AccountScreen(props) {
  const { userAccessToken } = useContext(AuthContext);
  const user = jwtDecode(userAccessToken);
  return (
    <Screen>
      <View style={styles.container}>
        <ListItem
          title={`${user.firstName} ${user.lastName}`}
          subtitle={user.emailAddress}
          onPress={console.log("ok")}
          IconComponent={
            <ListIcon
              name="account-circle-outline"
              backgroundColor={colors.blue}
            />
          }
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={settingsItems}
          keyExtractor={(settingsItem) => settingsItem.title}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <ListIcon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
            />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
