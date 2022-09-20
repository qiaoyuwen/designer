import { useCallback, useMemo } from 'react';
import { IParamsType, IProTableProps } from './types';
import { Table, ConfigProvider, TablePaginationConfig, Card } from 'antd';
import { useFetchData } from './hooks/useFetchData';
import zh_CN from 'antd/lib/locale/zh_CN';
import { HttpParams, IHttpPaginationResponse } from '../../http/types';
import { HttpUtils } from '../../http';
import { useTableRequest } from './hooks/useTableRequest';
import { SearchForm } from './components';
import { useMountMergeState } from '../../hooks';
import { stringify } from './utils';
import { ColumnValueType } from './enums';

export const ProTable = <DataType extends Record<string, any>, Params extends IParamsType = IParamsType>(
  props: IProTableProps<DataType, Params>,
) => {
  const {
    rowKey,
    columns: propsColumns,
    requestConifg,
    params,
    pagination: propsPagination,
    tableClassName,
    tableStyle,
  } = props;
  const [formSearch, setFormSearch] = useMountMergeState<Record<string, any>>({});

  const [request] = useTableRequest<IHttpPaginationResponse<DataType>>((params?: HttpParams) => {
    return HttpUtils.getPaginationJson<IHttpPaginationResponse<DataType>>(requestConifg?.url, params);
  });

  const fetchData = useMemo(() => {
    if (!requestConifg?.url) return undefined;
    return async (pageParams?: Record<string, any>) => {
      const actionParams = {
        ...(pageParams || {}),
        ...formSearch,
        ...params,
      };
      const response = await request(actionParams as unknown as Params);

      return response;
    };
  }, [formSearch, params, request, requestConifg]);

  const action = useFetchData(fetchData, {
    pageInfo: propsPagination === false ? false : propsPagination,
    loading: props.loading,
    dataSource: props.dataSource as any,
    onPageInfoChange: (pageInfo) => {
      if (!propsPagination || !requestConifg?.url) return;

      propsPagination?.onChange?.(pageInfo.current, pageInfo.pageSize);
      propsPagination?.onShowSizeChange?.(pageInfo.current, pageInfo.pageSize);
    },
    effects: [stringify(params), formSearch, stringify(requestConifg)],
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

  const columns = useMemo(() => {
    return propsColumns.map((column) => {
      if (column.valueType === ColumnValueType.Select && !column.render) {
        column.render = (dom, entity) => {
          const label = column.valueOptions?.find(
            (item) => item.value === entity[column.dataIndex || column.key || ''],
          )?.label;

          return label || '-';
        };
      }

      return {
        ...column,
      };
    });
  }, [propsColumns]);

  const getTableProps = () => ({
    className: tableClassName,
    style: tableStyle,
    columns: columns,
    loading: action.loading,
    dataSource: action.dataSource,
    pagination,
    onChange: (changePagination: TablePaginationConfig) => {
      action.setPageInfo(changePagination);
    },
  });

  const onFormSearchSubmit = useCallback(
    (values) => {
      setFormSearch({
        ...values,
      });
    },
    [setFormSearch],
  );

  const onFormSearchReset = useCallback(() => {
    setFormSearch({});
    action.setPageInfo({
      current: 1,
    });
  }, [action, setFormSearch]);

  return (
    <ConfigProvider locale={zh_CN}>
      <div style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
        <Card style={{ marginBottom: 24 }}>
          <SearchForm columns={columns} onFormSearchSubmit={onFormSearchSubmit} onFormSearchReset={onFormSearchReset} />
        </Card>
        <Card>
          <Table {...getTableProps()} rowKey={rowKey} />
        </Card>
      </div>
    </ConfigProvider>
  );
};
