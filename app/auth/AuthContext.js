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
  const [error, setError] = useState(false);

  const login = (emailAddress, password) => {
    setError(false);
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
        if (e.response.status) {
          if (e.response.status === 400) {
            setError(true);
          }
        } else {
          console.log("Erreur : " + e);
        }
      });
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
      })
      .catch((error) => {
        console.log(`Logout error ${error}`);
      });
    setIsLoading(false);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
