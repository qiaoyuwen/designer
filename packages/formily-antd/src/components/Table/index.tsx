import { useMemo } from 'react';
import { IParamsType, IProTableProps } from './types';
import { Table, ConfigProvider } from 'antd';
import { useFetchData } from './hooks/useFetchData';
import zh_CN from 'antd/lib/locale/zh_CN';
import { HttpParams, IHttpPaginationResponse } from '../../http/types';
import { HttpUtils } from '../../http';
import { useTableRequest } from './hooks/useTableRequest';

export const ProTable = <DataType extends Record<string, any>, Params extends IParamsType = IParamsType>(
  props: IProTableProps<DataType, Params>,
) => {
  const { rowKey, columns, url, params, pagination: propsPagination, tableClassName, tableStyle } = props;
  const [request] = useTableRequest<IHttpPaginationResponse<DataType>>((params?: HttpParams) => {
    return HttpUtils.getPaginationJson<IHttpPaginationResponse<DataType>>(url, params);
  });

  const fetchData = useMemo(() => {
    if (!url) return undefined;
    return async (pageParams?: Record<string, any>) => {
      const actionParams = {
        ...(pageParams || {}),
        ...params,
      };
      const response = await request(actionParams as unknown as Params);

      return response;
    };
  }, [params, request, url]);

  const action = useFetchData(fetchData, {
    pageInfo: propsPagination === false ? false : propsPagination,
    loading: props.loading,
    dataSource: props.dataSource as any,
  });

  const pagination = useMemo(() => {
    if (propsPagination === false) {
      return false as const;
    }
    const pageConfig = {
      ...propsPagination,
      ...action.pageInfo,
    };
    return pageConfig;
  }, [propsPagination, action.pageInfo]);

  const getTableProps = () => ({
    className: tableClassName,
    style: tableStyle,
    columns: columns,
    loading: action.loading,
    dataSource: action.dataSource,
    pagination,
  });

  return (
    <ConfigProvider locale={zh_CN}>
      <Table {...getTableProps()} rowKey={rowKey} />
    </ConfigProvider>
  );
};
