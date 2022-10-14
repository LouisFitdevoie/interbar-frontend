import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { BASE_URL } from "../api/config.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [error, setError] = useState(false);

  const login = (emailAddress, password) => {
    setError(false);
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/login`, {
        emailAddress,
        password,
      })
      .then((res) => {
        setUserAccessToken(res.data.accessToken);
        console.log("Access token decoded : ");
        console.log(jwt_decode(res.data.accessToken));
        AsyncStorage.setItem("userToken", res.data.accessToken);
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
    setIsLoading(false);
  };

  const logout = (userAccessToken) => {
    setIsLoading(true);
    // axios
    //   .post(`${BASE_URL}/logout`, {
    //     token,
    //   })
    //   .then((res) => {
    //     console.log("Logout : " + res.data);
    //     setUserToken(null);
    //     AsyncStorage.removeItem("userToken");
    //     setUserToken(null);
    //   })
    //   .catch((error) => {
    //     console.log(`Logout error ${error}`);
    //   });
    console.log("Logout : " + userAccessToken);
    AsyncStorage.removeItem("userToken");
    setUserAccessToken(null);
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userTokenFromAS = await AsyncStorage.getItem("userToken");
      setUserAccessToken(userTokenFromAS);
      setIsLoading(false);
    } catch (e) {
      console.log("Error while trying to get userToken from AsyncStorage: ", e);
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
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
