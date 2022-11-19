import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../../components/Screen";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import RadioButton from "../../components/RadioButton";
import AppButton from "../../components/AppButton";
import SortMenu from "../../components/SortMenu";
import { AuthContext } from "../../auth/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import commandAPI from "../../api/command.api";
import { FlatList } from "react-native";
import CommandItem from "../../components/lists/CommandItem";
import ErrorMessage from "../../components/forms/ErrorMessage";

function CurrentEventScreen({
  navigation,
  organizer,
  startDate,
  endDate,
  location,
  description,
  role,
  eventId,
}) {
  const { isLoading, setIsLoading, userAccessToken, user, updateAccessToken } =
    useContext(AuthContext);
  const isFocused = useIsFocused();
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [sortOptionSelected, setSortOptionSelected] = useState("newest");
  const [paidOptionSelected, setPaidOptionSelected] = useState("all");

  const [commandItems, setCommandItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(commandItems);

  const sortOptions = [
    { name: "La plus récente d'abord", value: "newest" },
    { name: "La plus ancienne d'abord", value: "oldest" },
    { name: "La plus chère d'abord", value: "highest" },
    { name: "La moins chère d'abord", value: "lowest" },
  ];

  const paidOptions = [
    { name: "Toutes", value: "all" },
    { name: "Payées", value: "paid" },
    { name: "Non payées", value: "unpaid" },
  ];

  const getCommands = () => {
    setIsLoading(true);
    setError(null);
    commandAPI
      .getCommandsByEventId(eventId, userAccessToken)
      .then((res) => {
        console.log(`Found ${res.data.length} command(s) for this event`);
        setCommandItems(res.data);
        setSortOptionSelected("newest");
        setPaidOptionSelected("all");
        setDisplayedItems(
          res.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter((command) => {
              if (role === 0) {
                return command.client_id === user.id;
              } else if (role === 1) {
                return command.servedBy_id === user.id;
              } else {
                return true;
              }
            })
        );
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
        } else {
          if (err.response.status === 404) {
            setError(null);
          } else if (err.response.status === 403) {
            updateAccessToken();
            setError("Une erreur est survenue, veuillez réessayer");
          } else {
            setError("Une erreur est survenue");
            console.log(err.response.data.error);
          }
        }
      });
  };

  useEffect(() => {
    getCommands();
  }, [isFocused]);

  const handleSort = () => {
    setIsLoading(true);
    let itemsToDisplay = commandItems;
    if (paidOptionSelected === "paid") {
      itemsToDisplay = itemsToDisplay.filter((command) => {
        return command.isPaid;
      });
    } else if (paidOptionSelected === "unpaid") {
      itemsToDisplay = itemsToDisplay.filter((command) => {
        return !command.isPaid;
      });
    }
    itemsToDisplay = itemsToDisplay.sort((a, b) => {
      if (sortOptionSelected === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOptionSelected === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortOptionSelected === "highest") {
        //TODO -> Edit to get the total price of the command <=========================== TODO
        return b.totalPrice - a.totalPrice;
      } else if (sortOptionSelected === "lowest") {
        //TODO -> Edit to get the total price of the command <=========================== TODO
        return a.totalPrice - b.totalPrice;
      }
    });
    setDisplayedItems(itemsToDisplay);
    setIsLoading(false);
  };

  const setCommandPaid = (commandId) => {
    setIsLoading(true);
    setError(null);
    commandAPI
      .setCommandPaid(commandId, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        getCommands();
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
        } else {
          if (err.response.status === 404) {
            setError("Aucune commande n'a été trouvée");
          } else if (err.response.status === 403) {
            updateAccessToken();
            setError("Une erreur est survenue, veuillez réessayer");
          } else {
            setError("Une erreur est survenue");
            console.log(err.response.data.error);
          }
        }
      });
  };

  const setCommandServed = (commandId) => {
    setIsLoading(true);
    setError(null);
    commandAPI
      .setCommandServed(commandId, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        getCommands();
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
        } else {
          if (err.response.status === 404) {
            setError("Aucune commande n'a été trouvée");
          } else if (err.response.status === 403) {
            updateAccessToken();
            setError("Une erreur est survenue, veuillez réessayer");
          } else {
            setError("Une erreur est survenue");
            console.log(err.response.data.error);
          }
        }
      });
  };

  //TODO
  // - USER
  // --- Get the commands the user has made for this event -> DONE
  // --- Display them in a flatlist -> DONE
  //TODO --- Add the ability to sort the items by highest or lowest price (line 60 & 63)
  //--- Verify the ability to sort by newest or oldest (line 56 & 58) -> DONE
  //TODO --- Add the ability to the user to make a new command by redirecting him to a newCommandScreen (line 101)
  // - SELLER & ORGANIZER
  // --- Get the commands the seller has served for this event -> DONE
  // --- Display them in a flatlist -> DONE
  // --- Change the color of the command item if the command is not paid or served -> DONE
  // --- Verify the ability to filter by paid or unpaid (line 49 to 52) -> DONE
  // --- Add the ability to the seller/organizer to change the values of isPaid & isServed from this screen -> DONE
  //TODO --- Add the ability to the seller/organizer to make a new command by redirecting him to a newCommandScreen (line 101)

  return (
    <Screen style={styles.container}>
      <View style={styles.titleContainer}>
        <AppText style={styles.title}>
          {role === 0
            ? "Mes commandes"
            : role === 1
            ? "Commandes traitées"
            : "Toutes les commandes"}
        </AppText>
      </View>
      <SortMenu
        sortOptionSelected={sortOptionSelected}
        setSortOptionSelected={setSortOptionSelected}
        scrollOptionSelected={paidOptionSelected}
        setScrollOptionSelected={setPaidOptionSelected}
        sortOptions={sortOptions}
        role={role}
        scrollOptions={paidOptions}
        displayedItems={displayedItems}
        handleSort={() => handleSort()}
      />
      {displayedItems.length === 0 && (
        <View style={styles.noCommandContainer}>
          <AppText style={{ textAlign: "center" }}>
            Aucune commande ne correspond aux critères sélectionnés
          </AppText>
        </View>
      )}
      {displayedItems.length > 0 && (
        <FlatList
          data={displayedItems}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 10 }}
          refreshing={refreshing}
          onRefresh={() => getCommands()}
          renderItem={({ item }) => (
            <CommandItem
              clientName={item.client_name}
              products={item.events_products_commands}
              commandId={item.id}
              totalPrice="2,5"
              isPaid={item.isPaid}
              isServed={item.isServed}
              setCommandPaid={() => setCommandPaid(item.id)}
              setCommandServed={() => setCommandServed(item.id)}
              role={role}
            />
          )}
        />
      )}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Nouvelle commande"
          onPress={() => console.log("nouvelle commande")}
        />
        <ErrorMessage error={error} visible={error != null} />
      </View>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  noCommandContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    paddingHorizontal: 10,
    color: colors.primary,
  },
  titleContainer: {
    alignItems: "center",
  },
});

export default CurrentEventScreen;
