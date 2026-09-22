import axios from "axios";
import store from "store";
import { notification } from "antd";

const apiClient = axios.create({
  // baseURL: 'https://192.168.43.80:8090',
  // baseURL: 'https://103.8.167.194:9090',
  baseURL: "http://localhost:9091",
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

apiClient.interceptors.request.use((request) => {
  // console.log(request.url, 'request.url', request.url.includes('emailId'))
  if (request.url.includes("emailId") === false) {
    // document.getElementsByClassName('initial__loading')[0].style.display = 'block'
  }
  const organization = store.get("selectedOrg") || {};
  // console.log(request, 'request')
  const excludeOrgCodeFor = [
    // 'listAllAccounts',
    // 'getParentAccountType',
    // 'getAccountType',
    "saveOrg",
    "organization",
    "sign-in",
    // 'getSubGroupAccountsByAccId',
    // 'isees/all',
  ];
  const value = excludeOrgCodeFor.filter((item) => request.url.includes(item));
  const accessToken = store.get("accessToken");
  // console.log(organization,value,'value')
  if (organization.orgCode && organization.orgCode.length && !value.length) {
    request.headers.currDate = organization.currDate || "";
    request.headers.orgCode = organization.orgCode || "";
  }
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
    request.headers.AccessToken = accessToken;
  }
  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error ? error.response : undefined;
    if (response && response.data && response.data.statusCode === 404) {
      if (response.data.message) {
        notification.warning({
          message: "Error",
          description: response.data.message,
        });
      } else {
        notification.error({
          message: "Error",
          description: "Something went wrong",
        });
      }
    } else if (response && response.data && response.data.message) {
      notification.error({
        message: "Error",
        description: response.data.message,
      });
    }
    return Promise.reject(error);
  },
);

export default apiClient;
