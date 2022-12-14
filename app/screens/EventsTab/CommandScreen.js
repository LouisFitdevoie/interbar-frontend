import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import * as Yup from "yup";

import Screen from "../../components/Screen";
import AppText from "../../components/AppText";
import { AuthContext } from "../../auth/AuthContext";
import eventProductAPI from "../../api/eventProduct.api";
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import userEventAPI from "../../api/userEvent.api";
import commandAPI from "../../api/command.api";
import eventProductCommandAPI from "../../api/eventProductCommand.api";
import AppButton from "../../components/AppButton";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";
import ProductCommandItem from "../../components/lists/ProductCommandItem";
import colors from "../../config/colors";
import MoneyBackInput from "../../components/MoneyBackInput";
import { Platform } from "react-native";

function CommandScreen(props) {
  const { navigation } = props;
  useLayoutEffect(() => {
    tabBarDisplayManager.hideTabBar(navigation);
  }, []);

  const { eventId, role, commandId, isPaid, isServed, eventFinished } =
    props.route.params;
  const { userAccessToken, updateAccessToken, isLoading, setIsLoading, user } =
    useContext(AuthContext);
  const [error, setError] = useState(null);

  const [productsSold, setProductsSold] = useState([]);
  const [productsDisplayed, setProductsDisplayed] = useState(productsSold);
  const [quantities, setQuantities] = useState([]);
  const [initialQuantities, setInitialQuantities] = useState([]);
  const [quantityError, setQuantityError] = useState(false);
  const [clientSelected, setClientSelected] = useState(null);
  const [isEditCommand, setIsEditCommand] = useState(false);

  const today = new Date();

  useEffect(() => {
    const birthDate = new Date(user.birthday.split(" ")[0]);
    const age = today.getFullYear() - birthDate.getFullYear();
    const alcoholAllowed = role === 0 ? (age >= 18 ? true : false) : true;
    if ((isPaid && isServed) || eventFinished) {
      navigation.setOptions({ title: "D??tails de la commande" });
    } else if (commandId) {
      navigation.setOptions({ title: "Modifier la commande" });
    } else {
      navigation.setOptions({ title: "Nouvelle commande" });
    }
    if (commandId) {
      setIsLoading(true);
      setError(null);
      eventProductCommandAPI
        .getAllInfosForCommand(commandId, userAccessToken)
        .then((response) => {
          setClientSelected({
            clientId: response.data.client.id,
            clientName:
              response.data.client.firstName +
              " " +
              response.data.client.lastName,
          });
          const productsInCommand = response.data.products;
          eventProductAPI
            .getAllProductsAtEvent(eventId, userAccessToken)
            .then((res) => {
              setProductsSold(
                res.data.filter((product) => {
                  if (product.category === 1 && !alcoholAllowed) {
                    return false;
                  } else {
                    return true;
                  }
                })
              );
              let quantitiesArray = [];
              res.data.forEach((product) => {
                if (
                  (alcoholAllowed && product.category === 1) ||
                  product.category !== 1
                ) {
                  const eventProductCommandId = null;
                  const productId = product.events_products_id;
                  const quantity = 0;
                  const error = false;
                  quantitiesArray.push({
                    eventProductCommandId,
                    productId,
                    quantity,
                    error,
                  });
                }
              });
              productsInCommand.forEach((product) => {
                const eventProductCommandId = product.eventProductCommandId;
                const quantity = product.number;
                quantitiesArray.forEach((p) => {
                  if (p.productId === product.productId) {
                    p.eventProductCommandId = eventProductCommandId;
                    p.quantity = quantity;
                  }
                });
              });
              setProductsDisplayed(
                res.data.filter((product) => {
                  if (product.category === 1 && !alcoholAllowed) {
                    return false;
                  } else {
                    return true;
                  }
                })
              );
              setQuantities(quantitiesArray);
              setInitialQuantities(quantitiesArray);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              if (err.response.status === 403) {
                updateAccessToken();
                setError(
                  "Impossible de r??cup??rer le tarif de l'??v??nement, veuillez r??essayer"
                );
              } else {
                console.log(err.response.data);
                setError("Une erreur est survenue");
              }
            });
        })
        .catch((error) => {
          if (error.response === undefined) {
            setError("Impossible de communiquer avec le serveur");
          } else {
            if (error.response.status === 403) {
              updateAccessToken();
              setError("Une erreur est survenue, veuillez r??essayer");
              navigation.goBack();
            } else if (error.response.status === 404) {
              setError(
                "Nous n'avons pas r??ussi ?? r??cup??rer les informations de la commande"
              );
            } else {
              setError("Une erreur est survenue");
            }
          }
        });
    } else {
      setIsLoading(true);
      setError(null);
      eventProductAPI
        .getAllProductsAtEvent(eventId, userAccessToken)
        .then((res) => {
          setProductsSold(
            res.data.filter((product) => {
              if (product.stock > 0) {
                if (product.category === 1 && !alcoholAllowed) {
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            })
          );
          setProductsDisplayed(
            res.data.filter((product) => {
              if (product.stock > 0) {
                if (product.category === 1 && !alcoholAllowed) {
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            })
          );
          setQuantities(
            res.data
              .filter((product) => {
                if (product.stock > 0) {
                  if (product.category === 1 && !alcoholAllowed) {
                    return false;
                  } else {
                    return true;
                  }
                } else {
                  return false;
                }
              })
              .map((product) => ({
                productId: product.events_products_id,
                quantity: 0,
                error: false,
              }))
          );
          setInitialQuantities(
            res.data
              .filter((product) => {
                if (product.stock > 0) {
                  if (product.category === 1 && !alcoholAllowed) {
                    return false;
                  } else {
                    return true;
                  }
                } else {
                  return false;
                }
              })
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
              "Impossible de r??cup??rer le tarif de l'??v??nement, veuillez r??essayer"
            );
          } else {
            console.log(err.response.data);
            setError("Une erreur est survenue");
          }
        });
    }
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
    const handleClientCommand = () => {
      setIsLoading(true);
      setError(null);
      if (commandId) {
        const promises = [];
        quantities.forEach((quantity) => {
          if (quantity.quantity > 0 && quantity.eventProductCommandId != null) {
            promises.push(
              eventProductCommandAPI.updateProductNumber(
                quantity.eventProductCommandId,
                quantity.quantity,
                commandId,
                userAccessToken
              )
            );
          } else if (
            quantity.quantity > 0 &&
            quantity.eventProductCommandId === null
          ) {
            promises.push(
              eventProductCommandAPI.addProductToCommand(
                quantity.productId,
                commandId,
                quantity.quantity,
                userAccessToken
              )
            );
          } else if (
            quantity.quantity === 0 &&
            quantity.eventProductCommandId != null
          ) {
            promises.push(
              eventProductCommandAPI.deleteProductFromCommand(
                quantity.eventProductCommandId,
                userAccessToken
              )
            );
          }
        });
        Promise.all(promises)
          .then((res) => {
            setIsLoading(false);
            setIsEditCommand(false);
            navigation.goBack();
            Alert.alert("Succ??s !", "Votre commande a bien ??t?? modifi??e !");
          })
          .catch((err) => {
            setIsLoading(false);
            if (err.response === undefined) {
              setError("Impossible de communiquer avec le serveur");
            } else {
              if (err.response.status === 403) {
                updateAccessToken();
                setError(
                  "Impossible de modifier la commande, veuillez r??essayer"
                );
              } else {
                console.log(err.response.data);
                setError("Une erreur est survenue");
              }
            }
          });
      } else {
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
                        quantities.filter((quantity) => quantity.quantity > 0)[
                          quantities.filter((quantity) => quantity.quantity > 0)
                            .length - 1
                        ].productId
                      ) {
                        setIsLoading(false);
                        navigation.goBack();
                        Alert.alert(
                          "Succ??s !",
                          "Votre commande a bien ??t?? cr????e !"
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
                            "Impossible de cr??er la commande, veuillez r??essayer"
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
                setError("Impossible de cr??er la commande, veuillez r??essayer");
              } else {
                console.log(err.response.data);
                setError("Une erreur est survenue");
              }
            }
          });
      }
    };

    const cancelCommand = () => {
      setIsLoading(true);
      setError(null);
      commandAPI
        .cancelCommand(commandId, userAccessToken)
        .then((res) => {
          setIsLoading(false);
          navigation.goBack();
          Alert.alert("Succ??s !", "Votre commande a bien ??t?? annul??e !");
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setError("Impossible de communiquer avec le serveur");
          } else {
            if (err.response.status === 403) {
              updateAccessToken();
              setError("Impossible d'annuler la commande, veuillez r??essayer");
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          }
        });
    };

    const totalPrice = () => {
      let total = 0;
      quantities.forEach((quantity) => {
        productsSold.forEach((product) => {
          if (quantity.productId === product.events_products_id) {
            total += quantity.quantity * product.sellingPrice;
          }
        });
      });
      return total;
    };
    const totalPriceToDisplay = totalPrice();

    return (
      <Screen style={styles.container} version="scroll">
        <View style={styles.subContainer}>
          <View
            style={
              productsDisplayed.length <= 4 || (commandId && isPaid && isServed)
                ? { width: "100%", paddingHorizontal: 10 }
                : { width: "100%", maxHeight: "70%", paddingHorizontal: 10 }
            }
          >
            {quantities.length > 0 && (
              <FlatList
                data={productsDisplayed}
                keyExtractor={(product) =>
                  product.events_products_id.toString()
                }
                renderItem={({ item }) => (
                  <ProductCommandItem
                    product={item}
                    role={role}
                    quantities={quantities}
                    setQuantities={setQuantities}
                    disabled={
                      isPaid ||
                      isServed ||
                      (commandId != null && !isEditCommand)
                    }
                  />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText>
                      Aucun produit n'est disponible pour cette commande
                    </AppText>
                  </View>
                )}
                style={{ width: "100%" }}
              />
            )}
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <View style={styles.commandPaidServed}>
              <View style={styles.detailContainer}>
                <AppText style={styles.detailTitle}>
                  Prix total de la commande :
                </AppText>
                <AppText style={styles.detailText}>
                  {totalPriceToDisplay.toString().replace(".", ",")} ???
                </AppText>
              </View>
            </View>
            {!commandId && !eventFinished && (
              <AppButton
                title="Valider la commande"
                onPress={() => handleClientCommand()}
                disabled={quantityError}
              />
            )}
            {commandId != null &&
              !eventFinished &&
              !isEditCommand &&
              !isPaid &&
              !isServed && (
                <AppButton
                  title="Modifier la commande"
                  onPress={() => setIsEditCommand(true)}
                />
              )}
            {commandId != null && !eventFinished && isEditCommand && (
              <View style={{ width: "100%" }}>
                <AppButton
                  title="Valider les modifications"
                  onPress={() => handleClientCommand()}
                  disabled={quantityError}
                />
                <AppButton
                  title="Annuler les modifications"
                  onPress={() => {
                    setIsEditCommand(false);
                    setQuantities(initialQuantities);
                  }}
                  style={{ marginTop: 0 }}
                />
              </View>
            )}
            {commandId != null &&
              !eventFinished &&
              !isPaid &&
              !isServed &&
              !isEditCommand && (
                <AppButton
                  title="Annuler la commande"
                  onPress={() => cancelCommand()}
                  disabled={commandId === null}
                  style={{ marginTop: 0 }}
                />
              )}
            <ErrorMessage error={error} visible={error != null} />
          </View>
          {isLoading && <LoadingIndicator />}
        </View>
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
            res.data.forEach((client) => {
              if (!users.find((user) => user.clientName === client.client_name))
                users.push({ clientName: client.client_name, id: null });
            });
            setUsersAtEvent(
              users.filter((user) => !user.clientName.includes("Anonymous"))
            );
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de r??cup??rer les utilisateurs participant ?? l'??v??nement, veuillez r??essayer"
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
            "Impossible de r??cup??rer les utilisateurs participant ?? l'??v??nement, veuillez r??essayer"
          );
        } else {
          console.log(err.response.data);
          setError("Une erreur est survenue");
        }
      });
  };

  const [commandInfos, setCommandInfos] = useState();

  useEffect(() => {
    getAllUsersAtEvent();
    if (commandId != null) {
      setIsLoading(true);
      setError(null);
      commandAPI
        .getCommandInfos(commandId, userAccessToken)
        .then((res) => {
          setCommandInfos(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setError("Impossible de communiquer avec le serveur");
          } else {
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de r??cup??rer les informations de la commande, veuillez r??essayer"
              );
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          }
        });
    }
  }, []);

  const [isCommandServed, setIsCommandServed] = useState(isServed);
  const [isCommandPaid, setIsCommandPaid] = useState(isPaid);

  const totalPrice = () => {
    let total = 0;
    quantities.forEach((quantity) => {
      productsSold.forEach((product) => {
        if (quantity.productId === product.events_products_id) {
          total += quantity.quantity * product.sellingPrice;
        }
      });
    });
    return total;
  };
  const totalPriceToDisplay = totalPrice();

  const handleCommandPaid = () => {
    setIsLoading(true);
    setError(null);
    if (!isCommandServed) {
      commandAPI
        .setServedById(commandId, user.id, userAccessToken)
        .then((res) => {
          commandAPI
            .setCommandPaid(commandId, userAccessToken)
            .then((res) => {
              setIsCommandPaid(true);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              if (err.response === undefined) {
                setError("Impossible de communiquer avec le serveur");
              } else {
                if (err.response.status === 403) {
                  updateAccessToken();
                  setError(
                    "Impossible de modifier le statut de la commande, veuillez r??essayer"
                  );
                } else {
                  console.log(err.response.data);
                  setError("Une erreur est survenue");
                }
              }
            });
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setError("Impossible de communiquer avec le serveur");
          } else {
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de marquer la commande comme pay??e, veuillez r??essayer"
              );
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          }
        });
    } else {
      commandAPI
        .setCommandPaid(commandId, userAccessToken)
        .then((res) => {
          setIsCommandPaid(true);
          setIsLoading(false);
          navigation.goBack();
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setError("Impossible de communiquer avec le serveur");
          } else {
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de modifier le statut de la commande, veuillez r??essayer"
              );
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          }
        });
    }
  };

  const handleCommandServed = () => {
    setIsLoading(true);
    setError(null);
    if (!isCommandPaid) {
      commandAPI
        .setServedById(commandId, user.id, userAccessToken)
        .then((res) => {
          commandAPI
            .setCommandServed(commandId, userAccessToken)
            .then((res) => {
              setIsCommandServed(true);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              if (err.response === undefined) {
                setError("Impossible de communiquer avec le serveur");
              } else {
                if (err.response.status === 403) {
                  updateAccessToken();
                  setError(
                    "Impossible de modifier le statut de la commande, veuillez r??essayer"
                  );
                } else {
                  console.log(err.response.data);
                  setError("Une erreur est survenue");
                }
              }
            });
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setError("Impossible de communiquer avec le serveur");
          } else {
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de marquer la commande comme pay??e, veuillez r??essayer"
              );
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          }
        });
    } else {
      commandAPI
        .setCommandServed(commandId, userAccessToken)
        .then((res) => {
          setIsCommandServed(true);
          setIsLoading(false);
          navigation.goBack();
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response === undefined) {
            setError("Impossible de communiquer avec le serveur");
          } else {
            if (err.response.status === 403) {
              updateAccessToken();
              setError(
                "Impossible de modifier le statut de la commande, veuillez r??essayer"
              );
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          }
        });
    }
  };

  const handleSellerCommand = () => {
    if (!commandId) {
      commandAPI
        .createSellerCommand(
          eventId,
          clientSelected.clientId,
          clientSelected.clientName,
          user.id,
          userAccessToken
        )
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
                      quantities.filter((quantity) => quantity.quantity > 0)[
                        quantities.filter((quantity) => quantity.quantity > 0)
                          .length - 1
                      ].productId
                    ) {
                      setIsLoading(false);
                      navigation.goBack();
                      Alert.alert(
                        "Succ??s !",
                        `La commande de ${clientSelected.clientName} a bien ??t?? cr????e !`
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
                          "Impossible de cr??er la commande, veuillez r??essayer"
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
              setError("Impossible de cr??er la commande, veuillez r??essayer");
            } else {
              console.log(err.response.data);
              setError("Une erreur est survenue");
            }
          }
        });
    } else {
      const promises = [];
      quantities.forEach((quantity) => {
        if (quantity.quantity > 0 && quantity.eventProductCommandId != null) {
          promises.push(
            eventProductCommandAPI.updateProductNumber(
              quantity.eventProductCommandId,
              quantity.quantity,
              commandId,
              userAccessToken
            )
          );
        } else if (
          quantity.quantity > 0 &&
          quantity.eventProductCommandId === null
        ) {
          promises.push(
            eventProductCommandAPI.addProductToCommand(
              quantity.productId,
              commandId,
              quantity.quantity,
              userAccessToken
            )
          );
        } else if (
          quantity.quantity === 0 &&
          quantity.eventProductCommandId != null
        ) {
          promises.push(
            eventProductCommandAPI.deleteProductFromCommand(
              quantity.eventProductCommandId,
              userAccessToken
            )
          );
        }
      });
      if (commandInfos.seller === null) {
        commandAPI
          .setServedById(commandId, user.id, userAccessToken)
          .then((res) => {
            Promise.all(promises)
              .then((res) => {
                setIsLoading(false);
                setIsEditCommand(false);
                navigation.goBack();
                Alert.alert(
                  "Succ??s !",
                  `La commande de ${clientSelected.clientName} a bien ??t?? modifi??e !`
                );
              })
              .catch((err) => {
                setIsLoading(false);
                if (err.response === undefined) {
                  setError("Impossible de communiquer avec le serveur");
                } else {
                  if (err.response.status === 403) {
                    updateAccessToken();
                    setError(
                      "Impossible de modifier la commande, veuillez r??essayer"
                    );
                  } else {
                    console.log(err.response.data);
                    setError("Une erreur est survenue");
                  }
                }
              });
          });
      } else {
        Promise.all(promises)
          .then((res) => {
            setIsLoading(false);
            setIsEditCommand(false);
            navigation.goBack();
            Alert.alert(
              "Succ??s !",
              `La commande de ${clientSelected.clientName} a bien ??t?? modifi??e !`
            );
          })
          .catch((err) => {
            setIsLoading(false);
            if (err.response === undefined) {
              setError("Impossible de communiquer avec le serveur");
            } else {
              if (err.response.status === 403) {
                updateAccessToken();
                setError(
                  "Impossible de modifier la commande, veuillez r??essayer"
                );
              } else {
                console.log(err.response.data);
                setError("Une erreur est survenue");
              }
            }
          });
      }
    }
  };

  const handleCommandCancel = () => {
    setIsLoading(true);
    setError(null);
    commandAPI
      .cancelCommand(commandId, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        navigation.goBack();
        Alert.alert(
          "Succ??s !",
          `La commande de ${clientSelected.clientName} a bien ??t?? annul??e !`
        );
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
        } else {
          if (err.response.status === 403) {
            updateAccessToken();
            setError("Impossible d'annuler la commande, veuillez r??essayer");
          } else {
            console.log(err.response.data);
            setError("Une erreur est survenue");
          }
        }
      });
  };

  return (
    <Screen style={styles.container} version="scroll">
      <View style={styles.subContainer}>
        {clientSelected === null && !eventFinished && (
          <View style={{ flex: 1, width: "100%", padding: 10 }}>
            <AppText
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.buttonPrimary,
                textAlign: "center",
              }}
            >
              Qui est le client ?
            </AppText>
            <View style={{ flex: 1 }}>
              <FlatList
                data={usersAtEvent}
                keyExtractor={(user) => user.clientName.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      setClientSelected({
                        clientId: item.id,
                        clientName: item.clientName,
                      })
                    }
                    style={{ paddingHorizontal: 5, paddingVertical: 10 }}
                  >
                    <AppText numberOfLines={1}>{item.clientName}</AppText>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText>
                      Aucun utilisateur n'est disponible pour cette commande
                    </AppText>
                  </View>
                )}
                style={{ width: "100%" }}
              />
            </View>
            <KeyboardAvoidingView
              style={{ padding: 5, paddingTop: 20, marginBottom: 0 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={50}
            >
              <AppText>Le client n'est pas encore dans la liste ? </AppText>
              <AppForm
                initialValues={{ clientName: "" }}
                onSubmit={(values) => {
                  setClientSelected({
                    clientId: null,
                    clientName: values.clientName,
                  });
                }}
                validationSchema={Yup.object().shape({
                  clientName: Yup.string()
                    .required("Le nom est requis")
                    .label("Nom du client"),
                })}
              >
                <AppFormField
                  name="clientName"
                  placeholder="Nom du client"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <SubmitButton title="Valider" />
              </AppForm>
            </KeyboardAvoidingView>
          </View>
        )}

        {clientSelected !== null && (
          <View style={{ width: "100%", paddingTop: 10 }}>
            <AppText
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.buttonPrimary,
                textAlign: "center",
              }}
            >
              Pour{" "}
              {clientSelected.clientName.split(" ")[1] === "undefined"
                ? clientSelected.clientName.split(" ")[0]
                : clientSelected.clientName}
            </AppText>
          </View>
        )}
        {quantities.length > 0 && clientSelected != null && (
          <View
            style={
              !(isPaid && isServed) && !eventFinished
                ? { width: "100%", maxHeight: "100%" }
                : { width: "100%", flex: 1 }
            }
          >
            <FlatList
              data={productsDisplayed}
              keyExtractor={(product) => product.events_products_id.toString()}
              persistentScrollbar={true}
              renderItem={({ item }) => (
                <ProductCommandItem
                  product={item}
                  role={role}
                  quantities={quantities}
                  setQuantities={setQuantities}
                  disabled={commandId && !isEditCommand}
                />
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText>
                    Aucun produit n'est disponible pour cette commande
                  </AppText>
                </View>
              )}
              style={{
                width: "100%",
                paddingHorizontal: 10,
              }}
            />
            <View>
              <View style={styles.detailContainer}>
                <AppText style={styles.detailTitle}>
                  Prix total de la commande :
                </AppText>
                <AppText style={styles.detailText}>
                  {totalPriceToDisplay.toString().replace(".", ",")} ???
                </AppText>
              </View>
              {!isCommandPaid && !eventFinished && (
                <MoneyBackInput totalPrice={totalPriceToDisplay} />
              )}
            </View>
            {!commandId && !eventFinished && (
              <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
                <AppButton
                  title="Valider la commande"
                  onPress={() => handleSellerCommand()}
                  disabled={quantityError}
                />
              </View>
            )}
            {commandId && !eventFinished && !isEditCommand && (
              <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
                {!isCommandPaid && !isCommandServed && (
                  <AppButton
                    title="Modifier la commande"
                    onPress={() => setIsEditCommand(true)}
                    style={{ marginBottom: 0 }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {!isCommandServed && (
                    <AppButton
                      title="Servie"
                      onPress={() => handleCommandServed()}
                      style={
                        isCommandPaid ? { width: "100%" } : { width: "49%" }
                      }
                    />
                  )}
                  {!isCommandPaid && (
                    <AppButton
                      title="Pay??e"
                      onPress={() => handleCommandPaid()}
                      style={
                        isCommandServed ? { width: "100%" } : { width: "49%" }
                      }
                    />
                  )}
                </View>
                {!isCommandPaid && !isCommandServed && (
                  <AppButton
                    title="Annuler la commande"
                    onPress={() => handleCommandCancel()}
                    style={{ marginTop: 0 }}
                  />
                )}
              </View>
            )}
            {commandId && !eventFinished && isEditCommand && (
              <View>
                <AppButton
                  title="Valider les modifications"
                  onPress={() => handleSellerCommand()}
                  disabled={quantityError}
                  style={{ marginBottom: 0 }}
                />
                <AppButton
                  title="Annuler les modifications"
                  onPress={() => {
                    setIsEditCommand(false);
                    setQuantities(initialQuantities);
                  }}
                />
              </View>
            )}
          </View>
        )}
        {commandId &&
          eventFinished != null &&
          isCommandPaid &&
          isCommandServed && (
            <View style={styles.commandPaidServed}>
              {role === 2 && commandInfos && (
                <View style={styles.detailContainer}>
                  <AppText style={styles.detailTitle}>Servie par </AppText>
                  <AppText
                    style={[styles.detailText, { maxWidth: "70%" }]}
                    numberOfLines={1}
                  >
                    {commandInfos.seller.firstname +
                      " " +
                      commandInfos.seller.lastname}
                  </AppText>
                </View>
              )}
              {commandInfos && (
                <View style={styles.createdAtContainer}>
                  <AppText style={styles.detailTitle}>
                    Cette commande a ??t?? pass??e le{" "}
                  </AppText>
                  <AppText
                    style={[
                      styles.detailText,
                      { textAlign: "center", width: "100%" },
                    ]}
                    numberOfLines={2}
                  >
                    {new Date(commandInfos.createdAt).toLocaleDateString(
                      "fr-FR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </AppText>
                </View>
              )}
            </View>
          )}
        {commandId && eventFinished && (!isCommandPaid || !isCommandServed) && (
          <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
            {!isCommandPaid && !isCommandServed && (
              <AppText>La commande n'a ni ??t?? pay??e, ni servie</AppText>
            )}
            {isCommandServed && !isCommandPaid && (
              <AppText>La commande n'a pas ??t?? pay??e</AppText>
            )}
            {!isCommandServed && isCommandPaid && (
              <AppText>La commande n'a pas ??t?? servie</AppText>
            )}
          </View>
        )}
        <ErrorMessage error={error} visible={error != null} />
        {isLoading && <LoadingIndicator />}
      </View>
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
  subContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.light,
  },
  commandPaidServed: {
    width: "100%",
    alignItems: "flex-start",
    paddingBottom: 10,
  },
  createdAtContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  detailText: {
    fontSize: 20,
  },
  detailContainer: {
    paddingTop: 5,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.buttonPrimary,
  },
});

export default CommandScreen;
