import { HttpUtils } from '@/http/request';
import type { User } from '@/models/user';

const prefix = '/user';

const getUserDetail = () => {
  return HttpUtils.getJson<User>(`${prefix}`);
};

export const UserServices = {
  getUserDetail,
};
