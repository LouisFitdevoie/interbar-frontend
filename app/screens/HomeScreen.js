import React, { useContext, useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Screen from "../components/Screen";
import { AuthContext } from "../auth/AuthContext";
import colors from "../config/colors";
import AppText from "../components/AppText";
import RadioButton from "../components/RadioButton";
import userEventAPI from "../api/userEvent.api";
import LoadingIndicator from "../components/LoadingIndicator";
import EventItem from "../components/lists/EventItem";
import AppButton from "../components/AppButton";
import tabBarDisplayManager from "../config/tabBarDisplayManager";

function HomeScreen(props) {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { user, setIsLoading, isLoading, userAccessToken, updateAccessToken } =
    useContext(AuthContext);
  const { navigation } = props;
  const [sortDateOptionSelected, setSortDateOptionSelected] = useState(3);
  const [sortRoleOptionsSelected, setSortRoleOptionsSelected] = useState(0);
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);
  const [errorMessage, setErrorMesssage] = useState(null);

  const [eventsItems, setEventsItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(eventsItems);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    tabBarDisplayManager.displayTabBar(navigation, insets);
    StatusBar.setBarStyle("dark-content");
  }, [isFocused]);

  const getEventsJoined = () => {
    setIsLoading(true);
    setErrorMesssage(null);
    userEventAPI
      .getAllEventsForUser(user.id, userAccessToken)
      .then((res) => {
        setEventsItems(res.data);
        setDisplayedItems(
          res.data.filter((event) => {
            const today = new Date();
            const eventStartDate = new Date(event.startdate);
            const eventEndDate = new Date(event.enddate);
            const isCurrent = eventStartDate < today && eventEndDate >= today;
            return true && isCurrent;
          })
        );
        setSortDateOptionSelected(3);
        setSortRoleOptionsSelected(0);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setErrorMesssage(
            "Impossible de r??cup??rer les ??v??nements, veuillez r??essayer"
          );
        }
      });
  };

  const sortDateOptions = [
    { name: "Tous les ??v??nements", option: 1 },
    { name: "??v??nements ?? venir", option: 0 },
    { name: "??v??nements termin??s", option: 2 },
    { name: "??v??nements en cours", option: 3 },
  ];
  const sortRoleOptions = [
    { name: "Tous les r??les", option: 0 },
    { name: "Organisateur", option: 1 },
    { name: "Vendeur", option: 2 },
    { name: "Participant", option: 3 },
  ];

  const handleSort = () => {
    setIsLoading(true);
    const itemsToDisplay = eventsItems.filter((event) => {
      if (sortDateOptionSelected === 0) {
        const today = new Date();
        const eventStartDate = new Date(event.startdate);
        const isNext = eventStartDate >= today;
        if (sortRoleOptionsSelected === 0) {
          return true && isNext;
        } else if (sortRoleOptionsSelected === 1) {
          return event.role === 2 && isNext;
        } else if (sortRoleOptionsSelected === 2) {
          return event.role === 1 && isNext;
        } else if (sortRoleOptionsSelected === 3) {
          return event.role === 0 && isNext;
        }
      } else if (sortDateOptionSelected === 1) {
        if (sortRoleOptionsSelected === 0) {
          return true;
        } else if (sortRoleOptionsSelected === 1) {
          return event.role === 2;
        } else if (sortRoleOptionsSelected === 2) {
          return event.role === 1;
        } else if (sortRoleOptionsSelected === 3) {
          return event.role === 0;
        }
      } else if (sortDateOptionSelected === 2) {
        const today = new Date();
        const eventEndDate = new Date(event.enddate);
        const isPast = eventEndDate < today;
        if (sortRoleOptionsSelected === 0) {
          return true && isPast;
        } else if (sortRoleOptionsSelected === 1) {
          return event.role === 2 && isPast;
        } else if (sortRoleOptionsSelected === 2) {
          return event.role === 1 && isPast;
        } else if (sortRoleOptionsSelected === 3) {
          return event.role === 0 && isPast;
        }
      } else if (sortDateOptionSelected === 3) {
        const today = new Date();
        const eventStartDate = new Date(event.startdate);
        const eventEndDate = new Date(event.enddate);
        const isCurrent = eventStartDate < today && eventEndDate >= today;
        if (sortRoleOptionsSelected === 0) {
          return true && isCurrent;
        } else if (sortRoleOptionsSelected === 1) {
          return event.role === 2 && isCurrent;
        } else if (sortRoleOptionsSelected === 2) {
          return event.role === 1 && isCurrent;
        } else if (sortRoleOptionsSelected === 3) {
          return event.role === 0 && isCurrent;
        }
      }
    });
    setDisplayedItems(itemsToDisplay);
    setIsLoading(false);
  };

  useEffect(() => {
    handleSort();
  }, [sortDateOptionSelected, sortRoleOptionsSelected]);

  const handleSortDateOptionChanged = (option) => {
    setSortDateOptionSelected(option);
    setIsSortOptionsVisible(false);
  };

  const handleSortRoleOptionChanged = (option) => {
    setSortRoleOptionsSelected(option);
    setIsSortOptionsVisible(false);
  };

  useEffect(() => {
    if (user) {
      isFocused && getEventsJoined();
      setSortDateOptionSelected(3);
      setSortRoleOptionsSelected(0);
    }
  }, [isFocused, user]);

  if (user) {
    return (
      <Screen style={styles.container} barStyle="dark">
        <AppText style={styles.welcome}>
          Bienvenue{" "}
          {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} !
        </AppText>
        <View style={styles.sortMenuContainer}>
          <View style={styles.sortView}>
            <View style={styles.sortTitle}>
              <AppText style={{ fontSize: 22 }}>
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
        <View style={styles.eventsContainer}>
          {errorMessage === null && (
            <FlatList
              data={displayedItems}
              keyExtractor={(event) => event.id.toString()}
              style={styles.eventList}
              renderItem={({ item }) => (
                <EventItem
                  eventName={item.name}
                  eventStartDate={item.startdate}
                  eventEndDate={item.enddate}
                  eventRole={item.role}
                  onPress={() => {
                    navigation.navigate("EventDefault", { event: item });
                  }}
                  eventOrganizer={item.role === 2 ? null : item.organizer}
                />
              )}
              ListEmptyComponent={
                <View style={styles.noEvent}>
                  <AppText style={{ textAlign: "center" }}>
                    Aucun ??v??nement ne correspond aux crit??res s??lectionn??s
                  </AppText>
                  <AppButton title="Actualiser" onPress={getEventsJoined} />
                </View>
              }
              refreshing={refreshing}
              onRefresh={() => {
                getEventsJoined();
              }}
            />
          )}
          {errorMessage != null && (
            <View style={styles.errorMessage}>
              <AppText style={styles.errorMessage}>{errorMessage}</AppText>
              <AppButton title="R??essayer" onPress={() => getEventsJoined()} />
            </View>
          )}
        </View>
        {isLoading && <LoadingIndicator />}
      </Screen>
    );
  } else {
    return (
      <Screen style={styles.loadingContainer} barStyle="dark">
        <View style={styles.waitingView}>
          <LoadingIndicator version="notAbsolute" />
          <AppText style={styles.waitingText}>
            Veuillez patienter pendant que nous r??cup??rons vos informations
          </AppText>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  errorMessage: {
    padding: 10,
    alignItems: "center",
  },
  eventsContainer: {
    flex: 1,
    width: "100%",
  },
  eventList: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  noEvent: {
    paddingHorizontal: 20,
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
    marginBottom: 0,
    paddingHorizontal: 10,
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
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  sortOptions: {
    padding: 5,
  },
  waitingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.buttonPrimary,
    textAlign: "center",
    marginTop: 10,
  },
  waitingView: {
    justifyContent: "flex-end",
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
