export interface User {
  ctime: string;
  id: string;
  username: string;
  isRoot: boolean;
}

export interface IUser {
  email: string;
  id: string;
  mobile: string;
  name: string;
  status: number;
  userId: string;
  avatar: string;
}

// 用户信息
export interface IUserInfo {
  account: {
    realName: string;
    mobile: string;
    email: string;
  },
  user: IUser;
}
