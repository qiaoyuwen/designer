import { HttpParams, IHttpPaginationResponse } from './types';
import axios from 'axios';

async function getPaginationJson<T>(url: string, params?: HttpParams): Promise<IHttpPaginationResponse<T>> {
  return axios
    .get<IHttpPaginationResponse<T>>(url, {
      params,
    })
    .then((res) => {
      return res.data;
    });
}

export const HttpUtils = {
  getPaginationJson,
};
