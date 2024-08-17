import ky from "ky";

const API_URL = process.env.API_URL;
export const api = ky.create({
  prefixUrl: API_URL,
  headers: {
    "content-type": "application/json",
  },
});
