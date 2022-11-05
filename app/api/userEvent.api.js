import axios from "axios";

import { BASE_URL } from "./config.api.js";

exports.userCreateEvent = (eventId, userId, userAccessToken) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/user-join-event`,
    data: {
      eventId,
      userId,
      role: 2,
    },
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
    },
  });
};

exports.userJoinEvent = (eventId, userId, userAccessToken) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/user-join-event`,
    data: {
      eventId,
      userId,
      role: 0,
    },
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
    },
  });
};

exports.sellerJoinEvent = (
  eventId,
  userId,
  sellerPassword,
  userAccessToken
) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/user-join-event`,
    data: {
      eventId,
      userId,
      sellerPassword,
      role: 1,
    },
    headers: {
      Authorization: `Bearer ${userAccessToken}`,
    },
  });
};
