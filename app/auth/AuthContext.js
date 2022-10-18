import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { BASE_URL } from "../api/config.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [userRefreshToken, setUserRefreshToken] = useState(null);
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
          AsyncStorage.setItem("userAccessToken", res.data.accessToken);
        })
        .catch((e) => {
          if (e.response.status === 404) {
            AsyncStorage.removeItem("userAccessToken");
            AsyncStorage.removeItem("userRefreshToken");
            setUserAccessToken(null);
            setUserRefreshToken(null);
            console.log("You have been disconnected");
          } else {
            console.log(e);
          }
        });
    } else {
      logout();
      return new Error("No refresh token found");
    }
  };

  const logout = (userRefreshToken) => {
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
      let userAccessTokenFromAS = await AsyncStorage.getItem("userAccessToken");
      let userRefreshTokenFromAS = await AsyncStorage.getItem(
        "userRefreshToken"
      );
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
