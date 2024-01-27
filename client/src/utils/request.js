import axios from "axios";

const service = axios.create({
  baseURL: "/api/",
  timeout: 6000
});

service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {

    let res = response.data;

    if (res.code !== 1) {
      alert(res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
