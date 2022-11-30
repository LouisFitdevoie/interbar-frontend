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
import eventProductAPI from "../../api/eventProduct.api";

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
    setCommandItems([]);
    setDisplayedItems([]);
    commandAPI
      .getCommandsByEventId(eventId, userAccessToken)
      .then((res) => {
        setCommandItems(res.data);
        setSortOptionSelected("newest");
        setPaidOptionSelected("all");
        setDisplayedItems(
          res.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter((command) => {
              if (role === 0) {
                return (
                  command.client_id === user.id ||
                  command.client_name ===
                    user.firstName.charAt(0).toUpperCase() +
                      user.firstName.slice(1) +
                      " " +
                      user.lastName.charAt(0).toUpperCase() +
                      user.lastName.slice(1)
                );
              } else if (role === 1) {
                return (
                  command.servedBy_id === user.id ||
                  command.servedBy_id === null
                );
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
    setDisplayedItems(
      commandItems
        .sort((a, b) => {
          if (sortOptionSelected === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
          } else if (sortOptionSelected === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
          } else if (sortOptionSelected === "highest") {
            return parseFloat(b.totalPrice) - parseFloat(a.totalPrice);
          } else if (sortOptionSelected === "lowest") {
            return parseFloat(a.totalPrice) - parseFloat(b.totalPrice);
          }
        })
        .filter((command) => {
          if (paidOptionSelected === "paid") {
            return command.isPaid;
          } else if (paidOptionSelected === "unpaid") {
            return !command.isPaid;
          } else {
            return true;
          }
        })
        .filter((command) => {
          if (role === 0) {
            return command.client_id === user.id;
          } else if (role === 1) {
            return (
              command.servedBy_id === user.id || command.servedBy_id === null
            );
          } else {
            return true;
          }
        })
    );
    setIsLoading(false);
  };

  // - USER
  // --- Get the commands the user has made for this event -> DONE
  // --- Display them in a flatlist -> DONE
  // --- Add the ability to sort the items by highest or lowest price (line 60 & 63) -> DONE
  // --- Verify the ability to sort by newest or oldest (line 56 & 58) -> DONE
  // --- Add the ability to the user to make a new command by redirecting him to a newCommandScreen (line 101) -> DONE
  // --- Add the ability to the user to edit a command -> DONE
  // --- Empêcher le client d’edit sa commande si isPaid et isServed mais afficher les détails quand même (new screen avec les quantités et le cout total de la commande) -> DONE
  // --- Ajouter un bouton pour annuler la commande -> DONE
  // --- Mettre isPaid et isServed à 0 si le client modifie sa commande -> DONE
  // - SELLER & ORGANIZER
  // --- Get the commands the seller has served for this event -> DONE
  // --- Display them in a flatlist -> DONE
  // --- Change the color of the command item if the command is not paid or served -> DONE
  // --- Verify the ability to filter by paid or unpaid (line 49 to 52) -> DONE
  // --- Add the ability to the seller/organizer to change the values of isPaid & isServed -> DONE
  // --- Add the ability to the seller/organizer to click on a command item to redirect him to a commandDetailsScreen -> DONE
  // --- Add the ability to the seller/organizer to make a new command by redirecting him to a newCommandScreen (line 101) -> DONE
  // --- Add the ability to the seller/organizer to edit a command -> DONE

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
        setSortOptionSelected={(value) => setSortOptionSelected(value)}
        scrollOptionSelected={paidOptionSelected}
        setScrollOptionSelected={(value) => setPaidOptionSelected(value)}
        sortOptions={sortOptions}
        scrollOptions={paidOptions}
        displayedItems={displayedItems}
        handleSort={() => handleSort()}
      />
      <View style={[{ width: "100%" }, error === null ? { flex: 1 } : {}]}>
        <FlatList
          data={displayedItems}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 10 }}
          refreshing={refreshing}
          onRefresh={() => getCommands()}
          ListEmptyComponent={
            <View style={styles.noCommandContainer}>
              <AppText style={{ textAlign: "center" }}>
                Aucune commande ne correspond aux critères sélectionnés
              </AppText>
              <AppButton title="Actualiser" onPress={() => getCommands()} />
            </View>
          }
          renderItem={({ item }) => (
            <CommandItem
              clientName={item.client_name}
              products={item.events_products_commands}
              commandId={item.id}
              totalPrice={item.totalPrice}
              isPaid={item.isPaid}
              isServed={item.isServed}
              role={role}
              navigation={navigation}
              eventId={eventId}
            />
          )}
        />
      </View>
      <View style={styles.buttonContainer}>
        {error === null && (
          <AppButton
            title="Nouvelle commande"
            onPress={() =>
              navigation.navigate("Command", { eventId: eventId, role: role })
            }
          />
        )}
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
