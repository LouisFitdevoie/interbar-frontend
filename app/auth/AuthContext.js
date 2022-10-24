import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { BASE_URL } from "../api/config.api";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [userRefreshToken, setUserRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = (emailAddress, password) => {
    setError(null);
    setIsLoading(true);
    axios({
      method: "post",
      url: `${BASE_URL}/login`,
      data: {
        emailAddress,
        password,
      },
    })
      .then((res) => {
        setUserAccessToken(res.data.accessToken);
        setUserRefreshToken(res.data.refreshToken);
        AsyncStorage.setItem("userAccessToken", res.data.accessToken);
        AsyncStorage.setItem("userRefreshToken", res.data.refreshToken);
        setUser(jwt_decode(res.data.accessToken));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.response === undefined) {
          setError("Impossible de communiquer avec le serveur");
          console.log("Erreur : " + e);
        } else {
          if (e.response.status === 400) {
            setError("Email/mot de passe incorrect");
          } else if (e.response.status === 404) {
            setError("Aucun compte lié à cette adresse email n'existe");
          } else {
            setError("Une erreur est survenue");
          }
        }
      });
  };

  const updateAccessToken = () => {
    if (userRefreshToken !== null) {
      console.log("Updating access token...");
      axios({
        method: "post",
        url: `${BASE_URL}/update-token`,
        data: {
          token: userRefreshToken,
        },
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      })
        .then((res) => {
          setUserAccessToken(res.data.accessToken);
          setUser(jwt_decode(res.data.accessToken));
          AsyncStorage.setItem("userAccessToken", res.data.accessToken);
        })
        .catch((e) => {
          if (e.response.status === 404) {
            AsyncStorage.removeItem("userAccessToken");
            AsyncStorage.removeItem("userRefreshToken");
            setUserAccessToken(null);
            setUserRefreshToken(null);
            Alert.alert(
              "Vous avez été déconnecté",
              "Veuillez vous reconnecter"
            );
          } else {
            console.log(e);
          }
        });
    } else {
      logout();
      return new Error("No refresh token found");
    }
  };

  const logout = () => {
    setIsLoading(true);
    axios({
      method: "delete",
      url: `${BASE_URL}/logout`,
      data: {
        token: userRefreshToken,
      },
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    })
      .then((res) => {
        AsyncStorage.removeItem("userAccessToken");
        AsyncStorage.removeItem("userRefreshToken");
        setUserAccessToken(null);
        setUserRefreshToken(null);
        setUser(null);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(`Logout error ${error}`);
        setIsLoading(false);
      });
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userRefreshTokenFromAS = await AsyncStorage.getItem(
        "userRefreshToken"
      );
      let userAccessTokenFromAS = await AsyncStorage.getItem("userAccessToken");
      //Verify if the userAccessToken is still valid and if not update it
      if (userAccessTokenFromAS !== null) {
        let decodedToken = jwt_decode(userAccessTokenFromAS);
        let currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          updateAccessToken();
        } else {
          setUser(decodedToken);
        }
      }
      setUserAccessToken(userAccessTokenFromAS);
      setUserRefreshToken(userRefreshTokenFromAS);
      setIsLoading(false);
    } catch (e) {
      console.log(
        "Error while trying to get userAccessToken or userRefreshToken from AsyncStorage: ",
        e
      );
    }
  };

  const isTokenExpired = () => {
    const token = userAccessToken;
    if (token) {
      const decodedToken = jwt_decode(token);
      const expirationTime = decodedToken.exp;
      return Date.now() >= expirationTime * 1000;
    } else {
      return true;
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoading,
        userAccessToken,
        userRefreshToken,
        error,
        setIsLoading,
        isTokenExpired,
        updateAccessToken,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
