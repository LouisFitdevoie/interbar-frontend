import axios from "axios";

import { BASE_URL } from "./config.api";

exports.addProductToCommand = (
  eventProductId,
  commandId,
  number,
  accessToken
) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/create-event-product-command`,
    data: {
      eventProductId,
      commandId,
      number,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.getAllInfosForCommand = (commandId, accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/infos-for-command/${commandId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.updateProductNumber = (eventProductCommandId, number, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/edit-event-product-command-number/${eventProductCommandId}`,
    data: {
      number,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};