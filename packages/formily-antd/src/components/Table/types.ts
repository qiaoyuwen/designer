import type { TableProps } from 'antd/lib/table';
import type { SpinProps } from 'antd/lib/spin';

export interface IParamsType extends Record<string, any> {}

export interface IRequestData<DataType> extends Record<string, any> {
  data: DataType[] | undefined;
  success?: boolean;
  total?: number;
}

export interface IProColumnType<DataType = Record<string, any>> {
  /** @name 确定这个列的唯一值,一般用于 dataIndex 重复的情况 */
  key?: React.Key;
  /**
   * 支持一个数字，[a,b] 会转化为 obj.a.b
   *
   * @name 与实体映射的key
   */
  dataIndex?: string | number;
  /**
   * @name 标题
   */
  title?: React.ReactNode;
  /**
   *
   * @name 自定义列渲染
   */
  render?: (
    dom: React.ReactNode,
    entity: DataType,
    index: number,
  ) =>
    | React.ReactNode
    | {
        children: React.ReactNode;
        props: any;
      };
}

export interface IProTableProps<DataType, ParamsType> extends Omit<TableProps<DataType>, 'columns' | 'rowSelection'> {
  url?: string;
  /**
   * @name 列配置能力，支持一个数组
   */
  columns?: IProColumnType<DataType>[];
  /**
   * request 的参数，修改之后会触发更新
   *
   * @example pathname 修改重新触发 request
   * params={{ pathName }}
   */
  params?: ParamsType;
  /** @name 获取 dataSource 的方法 */
  request?: (
    params: ParamsType & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
  ) => Promise<Partial<IRequestData<DataType>>>;
  /** @name 给封装的 table 的 className */
  tableClassName?: string;

  /** @name 给封装的 table 的 style */
  tableStyle?: React.CSSProperties;
}

export interface IPageInfo {
  pageSize: number;
  total: number;
  current: number;
}

export interface IUseFetchDataAction<DataType = any> {
  dataSource: DataType[];
  loading?: boolean | SpinProps;
  pageInfo: IPageInfo;
  reload: () => Promise<void>;
  reset: () => void;
  setPageInfo: (pageInfo: Partial<IPageInfo>) => void;
}

export interface IUseFetchProps {
  dataSource?: any[];
  loading?: IUseFetchDataAction['loading'];
  pageInfo:
    | {
        current?: number;
        pageSize?: number;
        defaultCurrent?: number;
        defaultPageSize?: number;
      }
    | false;
  onPageInfoChange?: (pageInfo: IPageInfo) => void;
  effects?: any[];
}
