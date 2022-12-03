import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppText from "../../components/AppText";
import {
  AppForm,
  AppFormField,
  ErrorMessage,
  SubmitButton,
} from "../../components/forms";
import LoadingIndicator from "../../components/LoadingIndicator";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import joinEventValidator from "../../validators/joinEvent.validator";
import { AuthContext } from "../../auth/AuthContext";
import AppButton from "../../components/AppButton";
import eventAPI from "../../api/event.api";
import tabBarDisplayManager from "../../config/tabBarDisplayManager";

function JoinEventScreen({ navigation }) {
  const isFocused = useIsFocused();
  const { isLoading, setIsLoading, userAccessToken, updateAccessToken } =
    useContext(AuthContext);
  const [isCameraViewVisible, setIsCameraViewVisible] = useState(false);
  const [joinEventError, setJoinEventError] = useState(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const insets = useSafeAreaInsets();
  useLayoutEffect(() => {
    tabBarDisplayManager.displayTabBar(navigation, insets);
  }, []);

  const joinEvent = (eventId) => {
    setIsLoading(true);
    setScanned(false);
    setJoinEventError(null);
    eventAPI
      .getEventById(eventId, userAccessToken)
      .then((res) => {
        setIsLoading(false);
        if (res.data) {
          const eventDetails = res.data;
          if (eventDetails.endDate < new Date()) {
            setJoinEventError(
              "Cet évènement est terminé, vous ne pouvez plus y participer"
            );
          } else {
            navigation.navigate("JoinEventDetails", { event: eventDetails });
          }
        } else {
          setJoinEventError("Event not found");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) {
          updateAccessToken();
          setJoinEventError("Une erreur est survenue, veuillez réessayer");
        }
      });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (type === "org.iso.QRCode") {
      setScanned(true);
      setIsCameraViewVisible(false);
      joinEvent(data);
    } else if (type !== "org.iso.QRCode") {
      setScanned(true);
      setIsCameraViewVisible(false);
      Alert.alert("Ce code barre n'est pas un QR Code");
    } else {
      return false;
    }
  };

  if (isFocused) {
    if (!isCameraViewVisible && hasPermission === null) {
      return (
        <Screen style={styles.container}>
          <AppForm
            initialValues={{
              eventCode: "",
            }}
            onSubmit={(values) => joinEvent(values.eventCode)}
            validationSchema={joinEventValidator}
          >
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="eventCode"
              placeholder="Code de l'évènement"
              textContentType="none"
            />
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <AppText style={styles.separatorText}>ou</AppText>
              <View style={styles.separator} />
            </View>
            <AppButton
              title="Scanner un QR Code"
              onPress={() => askForCameraPermission()}
            />
            <SubmitButton title="Suivant" />
            <ErrorMessage
              error={joinEventError}
              visible={joinEventError != null}
            />
          </AppForm>
          {isLoading && <LoadingIndicator />}
        </Screen>
      );
    } else if (!isCameraViewVisible && hasPermission === false) {
      return (
        <Screen style={styles.container}>
          <AppForm
            initialValues={{
              eventCode: "",
            }}
            onSubmit={(values) => joinEvent(values.eventCode)}
            validationSchema={joinEventValidator}
          >
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="eventCode"
              placeholder="Code de l'évènement"
              textContentType="none"
            />
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <AppText style={styles.separatorText}>ou</AppText>
              <View style={styles.separator} />
            </View>
            <AppButton
              title="Scanner un QR Code"
              onPress={() => {
                Alert.alert(
                  "Vous avez refusé l'accès à la caméra",
                  "Vous pouvez réessayer en autorisant l'accès à la caméra dans les paramètres de votre téléphone"
                );
              }}
            />
            <SubmitButton title="Suivant" />
            <ErrorMessage
              error={joinEventError}
              visible={joinEventError != null}
            />
          </AppForm>
          {isLoading && <LoadingIndicator />}
        </Screen>
      );
    } else if (!isCameraViewVisible && hasPermission === true) {
      return (
        <Screen style={styles.container}>
          <AppForm
            initialValues={{
              eventCode: "",
            }}
            onSubmit={(values) => joinEvent(values.eventCode)}
            validationSchema={joinEventValidator}
          >
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardAppearance={colors.colorScheme}
              keyboardType="default"
              name="eventCode"
              placeholder="Code de l'évènement"
              textContentType="none"
            />
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <AppText style={styles.separatorText}>ou</AppText>
              <View style={styles.separator} />
            </View>
            <AppButton
              title="Scanner un QR Code"
              onPress={() => setIsCameraViewVisible(!isCameraViewVisible)}
            />
            <SubmitButton title="Suivant" />
            <ErrorMessage
              error={joinEventError}
              visible={joinEventError != null}
            />
          </AppForm>
          {isLoading && <LoadingIndicator />}
        </Screen>
      );
    } else if (isCameraViewVisible && hasPermission === true) {
      return (
        <Screen style={styles.container}>
          <View style={styles.cameraView}>
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <AppButton
            title="Ne plus scanner"
            onPress={() => setIsCameraViewVisible(!isCameraViewVisible)}
          />
          {isLoading && <LoadingIndicator />}
        </Screen>
      );
    }
  } else {
    isCameraViewVisible ? setIsCameraViewVisible(false) : null;
    return null;
  }
}

const styles = StyleSheet.create({
  cameraView: {
    backgroundColor: colors.light,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.primary,
    height: Math.round(Dimensions.get("window").width * 0.95),
    width: Math.round(Dimensions.get("window").width * 0.95),
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
  separator: {
    width: "45%",
    height: 2,
    backgroundColor: colors.primary,
  },
  separatorContainer: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "95%",
  },
  separatorText: {
    color: colors.primary,
  },
});

export default JoinEventScreen;
