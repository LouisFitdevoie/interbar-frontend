import axios from "axios";

import { BASE_URL } from "./config.api";

exports.getCommandsByEventId = (eventId, accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/commands-with-event-id/${eventId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.setCommandPaid = (commandId, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/set-command-paid-state/${commandId}`,
    data: {
      paid: 1,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.setCommandServed = (commandId, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/set-command-served-state/${commandId}`,
    data: {
      served: 1,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.getClientNamesForEvent = (eventId, accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/event-client-names/${eventId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.createClientCommand = (eventId, clientId, accessToken) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/create-command`,
    data: {
      eventId,
      clientId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.createSellerCommand = (
  eventId,
  clientId,
  clientName,
  sellerId,
  accessToken
) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/create-command`,
    data: {
      eventId,
      clientId,
      clientName,
      sellerId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.setServedById = (commandId, sellerId, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/set-command-served-by/${commandId}`,
    data: {
      sellerId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.cancelCommand = (commandId, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/delete-command/${commandId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.getCommandInfos = (commandId, accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/command-infos/${commandId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
