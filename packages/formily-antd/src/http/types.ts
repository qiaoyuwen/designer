export type HttpParams = Record<string, any> | URLSearchParams;

export interface IHttpResponse<T> {
  code: string;
  message: string;
  success: boolean;
  data: T;
}

export interface IHttpPaginationResponseData<T> {
  list: T[];
  current: number;
  pageSize: number;
  total: number;
}
export type IHttpPaginationResponse<T> = IHttpResponse<IHttpPaginationResponseData<T>>;
