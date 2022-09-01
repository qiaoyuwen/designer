import { useEffect } from 'react';
import { IPageInfo, IRequestData, IUseFetchDataAction, IUseFetchProps } from '../types';
import { useMountMergeState, usePrevious } from '../../../hooks';

const mergeOptionAndPageInfo = ({ pageInfo }: IUseFetchProps) => {
  if (pageInfo) {
    const { current, defaultCurrent, pageSize, defaultPageSize } = pageInfo;
    return {
      current: current || defaultCurrent || 1,
      total: 0,
      pageSize: pageSize || defaultPageSize || 10,
    };
  }
  return { current: 1, total: 0, pageSize: 10 };
};

export const useFetchData = <T extends IRequestData<any>>(
  getData: undefined | ((params?: { pageSize: number; current: number }) => Promise<T>),
  options: IUseFetchProps,
): IUseFetchDataAction => {
  const [list, setList] = useMountMergeState<any[] | undefined>([], {
    value: options?.dataSource,
  });
  const [pageInfo, setPageInfo] = useMountMergeState<IPageInfo>(() => mergeOptionAndPageInfo(options), {
    onChange: options?.onPageInfoChange,
  });
  const [loading, setLoading] = useMountMergeState<IUseFetchDataAction['loading']>(false, {
    value: options?.loading,
  });

  const prePage = usePrevious(pageInfo?.current);
  const prePageSize = usePrevious(pageInfo?.pageSize);

  // Batching update  https://github.com/facebook/react/issues/14259
  const setDataAndLoading = (newData: T[], dataTotal: number) => {
    setList(newData);

    if (pageInfo?.total !== dataTotal) {
      setPageInfo({
        ...pageInfo,
        total: dataTotal || newData.length,
      });
    }
  };

  const setLoadingByType = (newLoading: boolean) => {
    if (typeof loading === 'object') {
      setLoading({ ...setLoading, spinning: newLoading });
    } else {
      setLoading(newLoading);
    }
  };

  /** 请求数据 */
  const fetchData = async () => {
    if (loading) {
      return [];
    }

    setLoadingByType(true);

    const { pageSize, current } = pageInfo || {};

    try {
      const pageParams =
        options?.pageInfo !== false
          ? {
              current,
              pageSize,
            }
          : undefined;

      const { data = [], success, total = 0 } = (await getData(pageParams)) || {};
      // 如果失败了，直接返回，不走剩下的逻辑了
      if (success === false) return [];

      setDataAndLoading(data, total);
      return data;
    } catch (e) {
    } finally {
      setLoadingByType(false);
    }
    return [];
  };

  /** PageIndex 改变重新请求数据 */
  useEffect(() => {
    const { current, pageSize } = pageInfo || {};
    // 如果上次的页码为空或者两次页码等于是没必要查询的
    // 如果 pageSize 发生变化是需要查询的，所以又加了 prePageSize
    if ((!prePage || prePage === current) && (!prePageSize || prePageSize === pageSize)) {
      return;
    }

    if ((options.pageInfo && list && list?.length > pageSize) || 0) {
      return;
    }

    // 如果 list 的长度大于 pageSize 的长度
    // 说明是一个假分页
    // (pageIndex - 1 || 1) 至少要第一页
    // 在第一页大于 10
    // 第二页也应该是大于 10
    if (current !== undefined && list && list.length <= pageSize) {
      fetchData();
    }
  }, [pageInfo?.current]);

  // pageSize 修改后重新请求数据
  useEffect(() => {
    if (!prePageSize) {
      return;
    }
    fetchData();
  }, [pageInfo?.pageSize]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    dataSource: list,
    loading,
    pageInfo,
    reload: async () => {
      await fetchData();
    },
    reset: async () => {
      const { pageInfo: optionPageInfo } = options || {};
      const { defaultCurrent = 1, defaultPageSize = 10 } = optionPageInfo || {};
      const initialPageInfo = {
        current: defaultCurrent,
        total: 0,
        pageSize: defaultPageSize,
      };
      setPageInfo(initialPageInfo);
    },
    setPageInfo: async (info) => {
      setPageInfo({
        ...pageInfo,
        ...info,
      });
    },
  };
};
