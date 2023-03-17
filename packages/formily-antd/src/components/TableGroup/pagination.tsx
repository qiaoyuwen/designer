import { FC } from 'react';
import { Pagination as AntdPagination } from 'antd';

export const Pagination: FC = (props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'end', marginTop: 12 }}>
      <AntdPagination {...props} />
    </div>
  );
};
