import axios from "axios";

import { BASE_URL } from "./config.api.js";

exports.getAllProducts = (accessToken) => {
  return axios({
    method: "get",
    url: `${BASE_URL}/products`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
