import axios from "axios";

import { BASE_URL } from "./config.api.js";

exports.register = (
  emailAddress,
  firstName,
  lastName,
  password,
  passwordConfirmation,
  birthday
) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/create-user`,
    data: {
      emailAddress,
      firstName,
      lastName,
      password,
      passwordConfirmation,
      birthday,
    },
  });
};

exports.editPersonalData = (
  userId,
  firstName,
  lastName,
  birthday,
  accessToken
) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/update-user`,
    data: {
      id: userId,
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      birthday,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.editPassword = (
  userId,
  oldPassword,
  newPassword,
  newPasswordConfirmation,
  accessToken
) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/update-user-password`,
    data: {
      id: userId,
      oldPassword,
      newPassword,
      newPasswordConfirmation,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
