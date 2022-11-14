import axios from "axios";

import { BASE_URL } from "./config.api.js";

exports.createEvent = (
  name,
  startDate,
  endDate,
  location,
  description,
  sellerPassword,
  accessToken
) => {
  return axios({
    method: "post",
    url: `${BASE_URL}/create-event`,
    data: {
      name,
      startDate,
      endDate,
      location,
      description,
      seller_password: sellerPassword,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.getEventById = (eventId, accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/eventId?id=${eventId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.cancelEvent = (eventId, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/delete-event/${eventId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

exports.endEvent = (eventId, accessToken) => {
  return axios({
    method: "put",
    url: `${BASE_URL}/update-event/${eventId}`,
    data: {
      endDate: new Date(),
      startDate: null,
      name: null,
      location: null,
      description: null,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
