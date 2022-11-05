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
