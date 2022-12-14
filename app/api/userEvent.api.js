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

exports.fromSellerToUser = (eventId, userId, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/seller-to-user`,
    data: {
      eventId,
      userId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.fromUserToSeller = (eventId, userId, sellerPassword, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/user-to-seller`,
    data: {
      eventId,
      userId,
      sellerPassword,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.getAllUsersFromEvent = (eventId, accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/users-for-event/${eventId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
