import React from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";

import Screen from "../components/Screen";
import AppText from "../components/AppText";

function DataUsageScreen(props) {
  return (
    <Screen version="scroll">
      <ScrollView>
        <View style={styles.container}>
          <AppText
            style={
              Platform.OS === "ios"
                ? styles.subtitle
                : [styles.subtitle, { marginTop: 0 }]
            }
          >
            1) Nom et prénom
          </AppText>
          <AppText style={styles.text}>
            Votre nom et votre prénom seront utilisés pour savoir qui doit être
            servi, si vous êtes client lors d'un évènement, ou qui sert les
            commandes, si vous êtes vendeur lors d'un évènement. Vos nom et
            prénom pourront être vus sur l'application par l'organisateur des
            évènements auxquels vous participerez ainsi que par les vendeurs de
            ceux-ci.
          </AppText>
          <AppText style={styles.subtitle}>2) Date de naissance</AppText>
          <AppText style={styles.text}>
            Votre date de naissance sera utilisée uniquement pour vérifier si
            vous êtes en âge de boire ou de vendre de l'alcool. Votre date de
            naissance ne sera pas visible sur l'application, sauf par vous.
          </AppText>
          <AppText style={styles.subtitle}>3) Adresse email</AppText>
          <AppText style={styles.text}>
            Votre adresse email sera utilisée uniquement pour vous connecter à
            l'application. Nous ne l'utiliserons pas pour communiquer avec vous.
            Votre adresse email ne sera pas visible sur l'application, sauf par
            vous.
          </AppText>
          <AppText style={styles.subtitle}>4) Stockage des données</AppText>
          <AppText style={styles.text}>
            Vos données seront stockées uniquement sur nos serveurs et ne seront
            pas partagées avec des tiers. Vous pourrez à tout moment supprimer
            votre compte et toutes vos données seront rendues anonymes.
          </AppText>
          <AppText style={styles.text}>
            Pour cela, nous remplacerons vos nom, prénom, adresse email et mot
            de passe par des valeurs aléatoires. Attention, si vous supprimez
            votre compte, vous ne pourrez plus vous y connecter et vous devrez
            recréer un nouveau compte pour pouvoir utiliserl'application à
            nouveau.
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  text: {
    marginTop: 10,
  },
});

export default DataUsageScreen;
