import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../components/Screen";
import { AuthContext } from "../auth/AuthContext";
import colors from "../config/colors";
import AppText from "../components/AppText";
import RadioButton from "../components/RadioButton";
import userEventAPI from "../api/userEvent.api";
import LoadingIndicator from "../components/LoadingIndicator";

function HomeScreen(props) {
  const isFocused = useIsFocused();
  const { user, setIsLoading, isLoading, userAccessToken } =
    useContext(AuthContext);
  const [sortDateOptionSelected, setSortDateOptionSelected] = useState(0);
  const [sortRoleOptionsSelected, setSortRoleOptionsSelected] = useState(0);
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);

  const [eventsItems, setEventsItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(eventsItems);

  const getEventsJoined = () => {
    setIsLoading(true);
    userEventAPI.getAllEventsForUser(user.id, userAccessToken).then((res) => {
      setEventsItems(res.data);
      setDisplayedItems(
        res.data.filter((event) => {
          const today = new Date();
          const eventStartDate = new Date(event.startdate);
          const eventEndDate = new Date(event.enddate);
          return (
            eventStartDate >= today ||
            (eventStartDate < today && eventEndDate >= today)
          );
        })
      );
      setSortDateOptionSelected(0);
      setSortRoleOptionsSelected(0);
      setIsLoading(false);
    });
  };

  const sortDateOptions = [
    { name: "Tous les évènements", option: 1 },
    { name: "Évènements à venir", option: 0 },
    { name: "Évènements terminés", option: 2 },
    { name: "Évènements en cours", option: 3 },
  ];
  const sortRoleOptions = [
    { name: "Tous les rôles", option: 0 },
    { name: "Organisateur", option: 1 },
    { name: "Vendeur", option: 2 },
    { name: "Participant", option: 3 },
  ];

  const handleSortDateOptionChanged = (option) => {
    setIsLoading(true);
    setSortDateOptionSelected(option);
    setIsSortOptionsVisible(false);
    if (option === 0) {
      setDisplayedItems(
        eventsItems.filter((event) => {
          const today = new Date();
          const eventStartDate = new Date(event.startdate);
          const eventEndDate = new Date(event.enddate);
          return (
            eventStartDate >= today ||
            (eventStartDate < today && eventEndDate >= today)
          );
        })
      );
    } else if (option === 1) {
      setDisplayedItems(eventsItems);
    } else if (option === 2) {
      setDisplayedItems(
        eventsItems.filter((event) => {
          const today = new Date();
          const eventEndDate = new Date(event.enddate);
          return eventEndDate < today;
        })
      );
    } else if (option === 3) {
      setDisplayedItems(
        eventsItems.filter((event) => {
          const today = new Date();
          const eventStartDate = new Date(event.startdate);
          const eventEndDate = new Date(event.enddate);
          return eventStartDate < today && eventEndDate >= today;
        })
      );
    }
    setIsLoading(false);
  };

  const handleSortRoleOptionChanged = (option) => {
    setSortRoleOptionsSelected(option);
    setIsSortOptionsVisible(false);
  };

  useEffect(() => {
    isFocused && getEventsJoined();
    setSortDateOptionSelected(0);
    setSortRoleOptionsSelected(0);
  }, [isFocused]);

  return (
    <Screen style={styles.container}>
      <AppText style={styles.welcome}>Bienvenue {user.firstName} !</AppText>
      <View style={styles.sortMenuContainer}>
        <View style={styles.sortView}>
          <View style={styles.sortTitle}>
            <AppText style={{ fontSize: 22 }}>
              {
                //display the name of the sortDateOptions where sortDateOptionSelected is equal to the option
              }
              {
                sortDateOptions.find(
                  (option) => option.option === sortDateOptionSelected
                ).name
              }{" "}
              ({displayedItems.length})
            </AppText>
            <TouchableOpacity
              style={[
                styles.sortButton,
                {
                  backgroundColor: isSortOptionsVisible
                    ? colors.buttonPrimary
                    : colors.white,
                },
              ]}
              onPress={() => setIsSortOptionsVisible(!isSortOptionsVisible)}
            >
              <MaterialCommunityIcons
                name="filter-variant"
                size={30}
                color={
                  isSortOptionsVisible ? colors.white : colors.buttonPrimary
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sortOptionsView}>
            {isSortOptionsVisible && (
              <View style={styles.sortOptions}>
                {sortDateOptions.map((sortOption) => (
                  <View key={sortOption.option}>
                    <TouchableOpacity
                      key={sortOption.option}
                      onPress={() =>
                        handleSortDateOptionChanged(sortOption.option)
                      }
                    >
                      <AppText
                        style={
                          sortDateOptionSelected === sortOption.option
                            ? styles.optionSelected
                            : styles.option
                        }
                      >
                        {sortOption.name}
                      </AppText>
                    </TouchableOpacity>
                    {sortOption.option !== sortDateOptions.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
        <ScrollView horizontal>
          {sortRoleOptions.map((sortOption) => (
            <RadioButton
              key={sortOption.option}
              value={sortOption.option}
              onPress={() => handleSortRoleOptionChanged(sortOption.option)}
              label={sortOption.name}
              stateValue={sortRoleOptionsSelected}
              style={{ paddingRight: 20 }}
            />
          ))}
        </ScrollView>
      </View>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
  option: {
    padding: 5,
    width: "100%",
    textAlign: "center",
    color: colors.light,
  },
  optionSelected: {
    padding: 5,
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    color: colors.white,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: colors.light,
    alignSelf: "center",
  },
  sortButton: {
    padding: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sortMenuContainer: {
    marginBottom: 20,
  },
  sortOptionsView: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 20,
    borderTopRightRadius: 0,
    width: 250,
  },
  sortTitle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  sortView: {
    marginTop: 10,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  sortOptions: {
    padding: 5,
  },
  welcome: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 28,
    fontWeight: "bold",
    color: colors.buttonPrimary,
  },
});

export default HomeScreen;
