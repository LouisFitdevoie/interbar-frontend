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

exports.getAllEventsForUser = (userId, accessToken) => {
  return axios({
    methode: "get",
    url: `${BASE_URL}/users-events/${userId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.leaveEvent = (eventId, userId, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/quit-event`,
    data: {
      eventId,
      userId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
