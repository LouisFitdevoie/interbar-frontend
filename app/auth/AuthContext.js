import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../api/config.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const login = (emailAddress, password) => {
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/login`, {
        emailAddress,
        password,
      })
      .then((res) => {
        console.log(res.data);
        setUserToken(res.data.accessToken);
        AsyncStorage.setItem("userToken", res.data.accessToken);
      })
      .catch((e) => {
        console.log(`Login error ${e}`);
      });
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    AsyncStorage.removeItem("userToken");
    setUserToken(null);
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userTokenFromAS = await AsyncStorage.getItem("userToken");
      setUserToken(userTokenFromAS);
      setIsLoading(false);
    } catch (e) {
      console.log("Error while trying to get userToken from AsyncStorage: ", e);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
