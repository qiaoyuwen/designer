import type { RequestConfig } from 'umi';
import { errorHandler, requestInterceptor, responseInterceptor } from './interceptors';
import { request } from 'umi';
import { RequestResponse } from 'umi-request';

export type HttpParams = Record<string, any> | URLSearchParams;

export interface HttpResponse<T> {
  code: string;
  message: string;
  success: boolean;
  data: T;
}
export interface HttpPaginationResponse<T> {
  list: T[];
  current: number;
  pageSize: number;
  total: number;
}

async function getFile(url: string, params?: HttpParams): Promise<RequestResponse<string>> {
  return request(url, {
    method: 'GET',
    params,
    getResponse: true,
    responseType: 'arrayBuffer',
  });
}

async function getJson<T>(url: string, params?: HttpParams): Promise<T> {
  return request<HttpResponse<T>>(url, {
    method: 'GET',
    params,
  }).then((res) => res.data);
}

async function getImageToBase64(url: string, params?: HttpParams): Promise<string> {
  return request(url, {
    method: 'GET',
    params,
    responseType: 'arrayBuffer',
  }).then(({ data }) => {
    return `data:image/png;base64,${btoa(
      new Uint8Array(data).reduce((resData, byte) => resData + String.fromCharCode(byte), ''),
    )}`;
  });
}

async function postJson<T>(url: string, data?: Record<string, any>): Promise<T> {
  return request<HttpResponse<T>>(url, {
    method: 'POST',
    data,
  }).then((res) => res.data);
}

async function postFile<T>(
  url: string,
  fileObj: Record<string, File | undefined | null>,
  jsonObj: Record<string, any> = {},
): Promise<T> {
  const formData = new FormData();
  Object.keys(fileObj).forEach((key) => {
    if (fileObj[key]) {
      formData.append(key, fileObj[key]!);
    }
  });
  Object.keys(jsonObj).forEach((key) => {
    formData.append(
      key,
      new Blob([JSON.stringify(jsonObj[key])], {
        type: 'application/json;charset=utf-8',
      }),
    );
  });
  return request(url, {
    method: 'POST',
    data: formData,
  });
}

async function deleteRequest(url: string, data?: Record<string, any>): Promise<void> {
  return request<HttpResponse<void>>(url, {
    method: 'DELETE',
    data,
  }).then((res) => res.data);
}

const objectToFormData = (obj: Record<string, any>) => {
  const formData = new FormData();
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key]);
  });
  return formData;
};

export const HttpUtils = {
  getFile,
  getJson,
  postJson,
  postFile,
  getImageToBase64,
  deleteRequest,
  objectToFormData,
};

const requestConfig: RequestConfig = {
  errorHandler,
  requestInterceptors: [requestInterceptor],
  responseInterceptors: [responseInterceptor],
};

export default requestConfig;
