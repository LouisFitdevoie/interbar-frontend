import React, { useContext } from "react";
import jwtDecode from "jwt-decode";
import { FlatList, StyleSheet, View } from "react-native";

import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import { AuthContext } from "../auth/AuthContext";
import ListIcon from "../components/lists/ListIcon";
import colors from "../config/colors";
import ListSeparator from "../components/lists/ListSeparator";

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
          title={`${
            user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
          } ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`}
          subtitle={user.emailAddress}
          IconComponent={
            <ListIcon
              name="account-circle-outline"
              backgroundColor={colors.blue}
            />
          }
          chevron={false}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={settingsItems}
          keyExtractor={(settingsItem) => settingsItem.title}
          ItemSeparatorComponent={() => <ListSeparator />}
          scrollEnabled={false}
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
