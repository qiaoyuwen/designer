import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { User } from '@/models/user';

const prefix = '/user';

const getUserDetail = () => {
  return HttpUtils.getJson<User>(`${prefix}`);
};

const login = (params: { username?: string; password?: string }) => {
  return HttpUtils.postJson<void>(`${prefix}/login`, params);
};

const getUsersPagination = (params?: HttpParams) => {
  return HttpUtils.getJson<HttpPaginationResponse<User>>(`${prefix}/pagination`, params);
};

export const UserServices = {
  getUserDetail,
  login,
  getUsersPagination,
};
