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
