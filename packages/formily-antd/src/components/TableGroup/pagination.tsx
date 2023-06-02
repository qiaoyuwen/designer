import { FC } from 'react';
import { Pagination as AntdPagination, PaginationProps } from 'antd';

export const Pagination: FC<
  PaginationProps & {
    value?: {
      total: number;
      current: number;
    };
  }
> = (props) => {
  const { onChange, value, ...innerProps } = props;
  return (
    <div style={{ display: 'flex', justifyContent: 'end', marginTop: 12 }}>
      <AntdPagination {...innerProps} {...value} />
    </div>
  );
};
