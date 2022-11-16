import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { User } from '@/models/user';
import { IUserInfo } from '@/models/user'

const prefix = '/user';

const getUserDetail = () => {
  return HttpUtils.getJson<IUserInfo>(`${prefix}/profile`);
};

const login = (params: { username?: string; password?: string }) => {
  return HttpUtils.postJson<void>(`${prefix}/login`, params);
};

const getUsersPagination = (params?: HttpParams) => {
  return HttpUtils.getJson<HttpPaginationResponse<User>>(`${prefix}/pagination`, params);
};

const addUser = (params: { username: string }) => {
  return HttpUtils.postJson<void>(`${prefix}/`, params);
};

const deleteUser = (params: { id: string }) => {
  return HttpUtils.deleteJson(`${prefix}/${params.id}`);
};

export const UserServices = {
  getUserDetail,
  login,
  getUsersPagination,
  addUser,
  deleteUser,
};
