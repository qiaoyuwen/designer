import { FC, PropsWithChildren } from 'react';
import { Table } from './table';
import { Pagination } from './pagination';

type ComposedTableGroup = FC<PropsWithChildren> & {
  InnerTable: any;
  Pagination: any;
};

export const TableGroup: ComposedTableGroup = (props) => {
  return <div>{props.children}</div>;
};

TableGroup.InnerTable = Table;
TableGroup.Pagination = Pagination;
