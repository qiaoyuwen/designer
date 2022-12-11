import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { Role } from '@/models';
import { AppConfig } from '@/configs/app'

const prefix = AppConfig.prefixs.api + '/role';

const getRolesPagination = (params?: HttpParams) => {
  return HttpUtils.getJson<HttpPaginationResponse<Role>>(`${prefix}/pagination`, params);
};

const addRole = (params: Pick<Role, 'name' | 'description' | 'permission'>) => {
  return HttpUtils.postJson<void>(`${prefix}/`, params);
};

const updateRole = (params: Pick<Role, 'id' | 'name' | 'description' | 'permission'>) => {
  return HttpUtils.putJson<void>(`${prefix}/${params.id}`, {
    ...params,
    id: undefined,
  });
};

const deleteRole = (params: { id: string }) => {
  return HttpUtils.deleteJson(`${prefix}/${params.id}`);
};

export const RoleServices = {
  getRolesPagination,
  addRole,
  updateRole,
  deleteRole,
};
