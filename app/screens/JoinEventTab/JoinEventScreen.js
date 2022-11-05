import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";

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

function JoinEventScreen({ navigation }) {
  const { isLoading, setIsLoading, userAccessToken } = useContext(AuthContext);
  const [isCameraViewVisible, setIsCameraViewVisible] = useState(false);
  const [joinEventError, setJoinEventError] = useState(null);

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{ eventCode: "" }}
        onSubmit={(values) => console.log(values)}
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
        {!isCameraViewVisible && (
          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <AppText style={styles.separatorText}>ou</AppText>
            <View style={styles.separator} />
          </View>
        )}
        {isCameraViewVisible && (
          <View style={styles.cameraView}>
            <AppText>Camera view</AppText>
          </View>
        )}
        {!isCameraViewVisible && (
          <AppButton
            title="Scanner un QR Code"
            onPress={() => setIsCameraViewVisible(!isCameraViewVisible)}
          />
        )}
        <SubmitButton title="Suivant" />
        <ErrorMessage error={joinEventError} visible={joinEventError != null} />
      </AppForm>
      {isLoading && <LoadingIndicator />}
    </Screen>
  );
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
