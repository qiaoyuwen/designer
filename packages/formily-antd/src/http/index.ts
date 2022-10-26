import { HttpParams, IHttpPaginationResponse, IHttpResponse } from './types';
import axios from 'axios';
import Qs from 'qs';

const HttpTokenKey = 'token';

axios.defaults.paramsSerializer = (params) => {
  return Qs.stringify(params, { arrayFormat: 'repeat' });
};

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(HttpTokenKey);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: token,
    };
  }
  return config;
});

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  const token = response.headers['Authorization'];
  if (token) {
    localStorage.setItem(HttpTokenKey, token);
  }
  return response;
});

async function getJson<T>(url: string, params?: HttpParams): Promise<T> {
  return axios
    .get<IHttpResponse<T>>(url, {
      params,
    })
    .then((res) => res.data.data);
}

async function getPaginationJson<T>(url: string, params?: HttpParams): Promise<IHttpPaginationResponse<T>> {
  return axios
    .get<IHttpPaginationResponse<T>>(url, {
      params,
    })
    .then((res) => {
      return res.data;
    });
}

async function postJson<T>(url: string, data?: Record<string, any>): Promise<T> {
  return axios.post<IHttpResponse<T>>(url, data).then((res) => res.data.data);
}

async function putJson<T>(url: string, data?: Record<string, any>): Promise<T> {
  return axios.put<IHttpResponse<T>>(url, data).then((res) => res.data.data);
}

async function deleteJson<T>(url: string): Promise<T> {
  return axios.delete<IHttpResponse<T>>(url).then((res) => res.data.data);
}

export const HttpUtils = {
  getJson,
  getPaginationJson,
  postJson,
  putJson,
  deleteJson,
};
