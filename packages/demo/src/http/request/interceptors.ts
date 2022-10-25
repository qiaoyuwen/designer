import { message, notification } from 'antd';
import type { RequestInterceptor, ResponseError, ResponseInterceptor } from 'umi-request';
import { HttpResponse } from '.';
import { CodeMessage } from './constant';
/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const errorHandler = (error: ResponseError<HttpResponse<any>>) => {
  const { response, data } = error;

  if (response && response.status) {
    const errorText = CodeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else {
    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    } else {
      // 业务错误
      message.warning(data.message);
    }
  }

  throw error;
};

// 请求拦截器
export const requestInterceptor: RequestInterceptor = (url, options) => {
  const token = localStorage.getItem('token');
  return {
    url: `/api${url}`,
    options: {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: token,
      },
    },
  };
};

// 响应拦截器
export const responseInterceptor: ResponseInterceptor = (response) => {
  const token = response.headers.get('Authorization');
  if (token) {
    localStorage.setItem('token', token);
  }
  return response;
};
