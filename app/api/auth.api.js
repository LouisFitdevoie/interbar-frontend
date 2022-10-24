import axios from "axios";

import { BASE_URL } from "./config.api.js";

exports.login = (emailAddress, password) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/login`,
    data: {
      emailAddress,
      password,
    },
  });
};

exports.updateAccessToken = (refreshToken, accessToken) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/update-token`,
    data: {
      token: refreshToken,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.logout = (refreshToken, accessToken) => {
  return axios({
    method: "delete",
    url: `${BASE_URL}/logout`,
    data: {
      token: refreshToken,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
