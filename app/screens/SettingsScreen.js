import React, { useContext } from "react";
import jwtDecode from "jwt-decode";
import { Alert, FlatList, StyleSheet, View, Dimensions } from "react-native";

import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import { AuthContext } from "../auth/AuthContext";
import ListIcon from "../components/lists/ListIcon";
import colors from "../config/colors";
import ListSeparator from "../components/lists/ListSeparator";
import LoadingIndicator from "../components/LoadingIndicator";

function AccountScreen({ navigation }) {
  const { userAccessToken, logout, isLoading } = useContext(AuthContext);
  const user = jwtDecode(userAccessToken);

  const settingsItems = [
    {
      title: "Modifier mes données personnelles",
      icon: {
        name: "card-account-details-outline",
        backgroundColor: colors.green,
      },
      onPress: () => navigation.navigate("EditPersonalData"),
    },
    {
      title: "Modifier mon mot de passe",
      icon: {
        name: "key-variant",
        backgroundColor: colors.primary,
      },
      onPress: () => navigation.navigate("EditPassword"),
    },
    {
      title: "Mode de couleur",
      icon: {
        name: "palette-outline",
        backgroundColor: colors.blue,
      },
      // onPress: () => navigation.navigate("ColorMode"),
      onPress: () =>
        Alert.alert("Mode de couleur", "En cours de développement"),
    },
    {
      title: "Supprimer mon compte",
      icon: {
        name: "delete-outline",
        backgroundColor: colors.danger,
      },
      onPress: () =>
        Alert.alert("Supprimer mon compte", "En cours de développement"),
    },
    {
      title: "Déconnexion",
      icon: {
        name: "logout",
        backgroundColor: colors.danger,
      },
      onPress: () => {
        Alert.alert(
          "Déconnexion",
          "Êtes-vous sûr de vouloir vous déconnecter ?",
          [
            {
              text: "Annuler",
              style: "cancel",
            },
            {
              text: "Déconnexion",
              onPress: () => logout(),
            },
          ],
          { cancelable: false }
        );
      },
    },
  ];
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
          scrollEnabled={Math.round(Dimensions.get("window").height) < 600} //If the screen height is less than 600, the FlatList is scrollable
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <ListIcon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={item.onPress}
            />
          )}
        />
      </View>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
