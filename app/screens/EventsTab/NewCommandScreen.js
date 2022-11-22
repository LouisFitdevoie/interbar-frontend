import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";

import Screen from "../../components/Screen";
import AppText from "../../components/AppText";
import { AuthContext } from "../../auth/AuthContext";
import eventProductAPI from "../../api/eventProduct.api";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ErrorMessage } from "../../components/forms";
import userEventAPI from "../../api/userEvent.api";
import commandAPI from "../../api/command.api";
import eventProductCommandAPI from "../../api/eventProductCommand.api";
import AppButton from "../../components/AppButton";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";
import NewProductCommandItem from "../../components/lists/NewProductCommandItem";
import colors from "../../config/colors";

function NewCommandScreen(props) {
  const { navigation } = props;
  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  const { eventId, role } = props.route.params;
  const { userAccessToken, updateAccessToken, isLoading, setIsLoading, user } =
    useContext(AuthContext);
  const [error, setError] = useState(null);

  const [productsSold, setProductsSold] = useState([]);
  const [productsDisplayed, setProductsDisplayed] = useState(productsSold);
  const [quantities, setQuantities] = useState([]);
  const [quantityError, setQuantityError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    eventProductAPI
      .getAllProductsAtEvent(eventId, userAccessToken)
      .then((res) => {
        setProductsSold(res.data.filter((product) => product.stock > 0));
        setProductsDisplayed(res.data.filter((product) => product.stock > 0));
        setQuantities(
          res.data
            .filter((product) => product.stock > 0)
            .map((product) => ({
              productId: product.events_products_id,
              quantity: 0,
              error: false,
            }))
        );
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setError(
            "Impossible de récupérer le tarif de l'évènement, veuillez réessayer"
          );
        } else {
          console.log(err.response.data);
          setError("Une erreur est survenue");
        }
      });
  }, []);

  useEffect(() => {
    if (quantities.filter((quantity) => quantity.error === true).length > 0) {
      setQuantityError(true);
    } else if (
      quantities.filter((quantity) => quantity.quantity > 0).length > 0
    ) {
      setQuantityError(false);
    } else {
      setQuantityError(true);
    }
  }, [quantities]);

  if (role === 0) {
    // Client -> pas besoin de choisir le nom du client

    const handleClientCommand = () => {
      setIsLoading(true);
      setError(null);
      commandAPI
        .createClientCommand(eventId, user.id, userAccessToken)
        .then((res) => {
          if (res.data.success != null) {
            const commandId = res.data.commandId;

            quantities
              .filter((quantity) => {
                if (quantity.quantity > 0) {
                  return true;
                }
              })
              .forEach((quantity) => {
                eventProductCommandAPI
                  .addProductToCommand(
                    quantity.productId,
                    commandId,
                    quantity.quantity,
                    userAccessToken
                  )
                  .then((res) => {
                    if (
                      quantity.productId ===
                      quantities[quantities.length - 1].productId
                    ) {
                      setIsLoading(false);
                      navigation.goBack();
                      Alert.alert(
                        "Succès !",
                        "Votre commande a bien été enregistrée, nous allons la préparer dans les plus brefs délais."
                      );
                    }
                  })
                  .catch((err) => {
                    setIsLoading(false);
                    if (err.response === undefined) {
                      setError("Impossible de communiquer avec le serveur");
                    } else {
                      if (err.response.status === 403) {
                        updateAccessToken();
                        setError(
                          "Impossible de créer la commande, veuillez réessayer"
                        );
                      } else {
                        console.log(err.response.data);
                        setError("Une erreur est survenue");
                      }
                    }
                  });
              });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setError("Impossible de communiquer avec le serveur");
          } else {
            if (err.response.status === 403) {
              updateAccessToken();
              setError("Impossible de créer la commande, veuillez réessayer");
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          }
        });
    };

    return (
      <Screen style={styles.container}>
        {quantities.length > 0 && (
          <FlatList
            data={productsDisplayed}
            keyExtractor={(product) => product.events_products_id.toString()}
            renderItem={({ item }) => (
              <NewProductCommandItem
                product={item}
                role={role}
                quantities={quantities}
                setQuantities={setQuantities}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={{ width: "100%" }}
          />
        )}
        <AppButton
          title="Valider la commande"
          onPress={() => handleClientCommand()} // Enregistrer la commande + Alert qui dit que la commande a bien été enregistrée et qu'elle sera traitée dans les plus brefs délais + rediriger vers la page de l'évènement
          disabled={quantityError}
        />
        <ErrorMessage error={error} visible={error != null} />
        {isLoading && <LoadingIndicator />}
      </Screen>
    );
  }

  const [usersAtEvent, setUsersAtEvent] = useState([]);

  const getAllUsersAtEvent = () => {
    setIsLoading(true);
    setError(null);
    userEventAPI
      .getAllUsersFromEvent(eventId, userAccessToken)
      .then((res) => {
        res.data.forEach(
          (user) => (user.clientName = user.firstname + " " + user.lastname)
        );
        let users = res.data;
        commandAPI
          .getClientNamesForEvent(eventId, userAccessToken)
          .then((res) => {
            res.data.forEach((clientName) => {
              if (!users.find((user) => user.clientName === clientName))
                users.push({ clientName });
            });
            console.log(users);
            setUsersAtEvent(users);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de récupérer les utilisateurs participant à l'évènement, veuillez réessayer"
              );
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          });
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setError(
            "Impossible de récupérer les utilisateurs participant à l'évènement, veuillez réessayer"
          );
        } else {
          console.log(err.response.data);
          setError("Une erreur est survenue");
        }
      });
  };

  useEffect(() => {
    getAllUsersAtEvent();
  }, []);

  return (
    <Screen style={styles.container}>
      <AppText>{eventId}</AppText>
      <ErrorMessage error={error} visible={error != null} />
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    padding: 10,
    backgroundColor: colors.white,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.light,
  },
});

export default NewCommandScreen;
