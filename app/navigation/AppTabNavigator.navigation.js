import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LogoutTestScreen from "../screens/LogoutTestScreen";
import colors from "../config/colors";
import { AuthContext } from "../auth/AuthContext";
import SettingsNavigator from "./SettingsNavigator.navigation.js";
import CreateEventStack from "./CreateEventStack.navigation";
import JoinEventStack from "./JoinEventStack.navigation";

const Tab = createBottomTabNavigator();

function AppTabNavigator(props) {
  const insets = useSafeAreaInsets();

  const { isLoading, updateAccessToken } = useContext(AuthContext);

  const timeToUpdateAccessToken = 10 * 60 * 1000; // 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updateAccessToken();
    }, timeToUpdateAccessToken);

    return () => clearInterval(interval);
  });

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.primary,
          height: insets.bottom + 60,
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.buttonPrimary,
      }}
      screenListeners={{
        //If isLoading -> don't navigate
        tabPress: (e) => {
          if (isLoading) {
            e.preventDefault();
          }
        },
      }}
    >
      <Tab.Screen
        name="Events"
        component={LogoutTestScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home-outline"
              size={30}
              color={color}
              style={{ marginTop: 5 }}
            />
          ),
          tabBarLabel: "Mes évènements",
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 5,
          },
        }}
      />
      <Tab.Screen
        name="Join"
        component={JoinEventStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="arrow-redo-circle-outline"
              size={35}
              color={color}
              style={{ marginTop: 5 }}
            />
          ),
          tabBarLabel: "Rejoindre",
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 5,
          },
        }}
      />
      <Tab.Screen
        name="CreateEventNavigator"
        component={CreateEventStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="add-circle-outline"
              size={35}
              color={color}
              style={{
                marginTop: 5,
                paddingLeft: 3,
              }}
            />
          ),
          tabBarLabel: "Créer",
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 5,
          },
        }}
      />
      <Tab.Screen
        name="SettingsNavigator"
        component={SettingsNavigator}
        options={{
          headerShown: false,
          headerTitle: "Paramètres",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="settings-outline"
              size={30}
              color={color}
              style={{
                marginTop: 5,
              }}
            />
          ),
          tabBarLabel: "Paramètres",
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 5,
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default AppTabNavigator;
