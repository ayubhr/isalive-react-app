// @ts-nocheck
import React from "react";

import axios from "axios";

const localStorageKey = "__auth_provider_token__";

const apiURL = process.env.REACT_APP_ISALIVE_URL;

const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(function (response) {
  return response.data;
});

export function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

export function setToken(token) {
  window.localStorage.setItem(localStorageKey, token);
}

export function clearToken() {
  return window.localStorage.removeItem(localStorageKey);
}

export function validateUsername(value, type) {
  var email =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  var phone = /^\d{8,16}$/;

  return type === "email" ? email.test(value) : phone.test(value);
}

export function isValidURL(string) {
  var pattern = new RegExp(
    "^((ft|htt)ps?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?" + // port
      "(\\/[-a-z\\d%@_.~+&:]*)*" + // path
      "(\\?[;&a-z\\d%@_.,~+&:=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(string);
}

export function capitalizeMe(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function createUUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 50; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "";

  var uuid = s.join("");
  return uuid;
}

export { api };
