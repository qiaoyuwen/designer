import { ArrayField, FieldDisplayTypes, GeneralField } from '@formily/core';
import { observer, RecursionField, useField, useFieldSchema } from '@formily/react';
import { Badge, Pagination, PaginationProps, Select, SelectProps, Space, Table } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { createContext, FC, Fragment, useEffect, useRef, useState } from 'react';
import { Schema } from '@formily/json-schema';
import { isArr, isBool } from '@designer/utils';
import { ArrayBase } from '@formily/antd-v5';
import React from 'react';
import classnames from 'classnames';

type IComposedNextTable = React.FC<React.PropsWithChildren<TableProps<any>>> & {
  Column?: React.FC<React.PropsWithChildren<ColumnProps<any>>>;
};

interface IObservableColumnSource {
  field: GeneralField;
  columnProps: ColumnProps<any>;
  schema: Schema;
  display: FieldDisplayTypes;
  name: string;
}

const isColumnComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Column') > -1;
};

const useNextTableSources = () => {
  const arrayField = useField();
  const schema = useFieldSchema();
  const parseSources = (schema: Schema): IObservableColumnSource[] => {
    if (isColumnComponent(schema)) {
      if (!schema['x-component-props']?.['dataIndex'] && !schema['name']) return [];
      const name = schema['x-component-props']?.['dataIndex'] || schema['name'];
      const field = arrayField.query(arrayField.address.concat(name)).take();
      const columnProps = field?.component?.[1] || schema['x-component-props'] || {};
      const display = field?.display || schema['x-display'] || 'visible';
      return [
        {
          name,
          display,
          field,
          schema,
          columnProps,
        },
      ];
    } else if (schema.properties) {
      return schema.reduceProperties((buf, schema) => {
        return buf.concat(parseSources(schema));
      }, []);
    }
  };

  const parseArrayItems = (schema: Schema['items']) => {
    if (!schema) return [];
    const sources: IObservableColumnSource[] = [];
    const items = isArr(schema) ? schema : [schema];
    return items.reduce((columns, schema) => {
      const item = parseSources(schema);
      if (item) {
        return columns.concat(item);
      }
      return columns;
    }, sources);
  };

  if (!schema) throw new Error('can not found schema object');

  return parseArrayItems(schema.items);
};

const useNextTableColumns = (
  dataSource: any[],
  field: ArrayField,
  sources: IObservableColumnSource[],
): TableProps<any>['columns'] => {
  return sources.reduce((buf, { name, columnProps, schema, display }, key) => {
    if (display !== 'visible') return buf;
    if (!isColumnComponent(schema)) return buf;
    return buf.concat({
      ...columnProps,
      key,
      dataIndex: name,
      render: (value: any, record: any) => {
        const index = dataSource?.indexOf(record);
        const children = (
          <ArrayBase.Item index={index} record={() => field?.value?.[index]}>
            <RecursionField schema={schema} name={index} onlyRenderProperties />
          </ArrayBase.Item>
        );
        return children;
      },
    });
  }, []);
};

const schedulerRequest = {
  request: null,
};

interface IStatusSelectProps extends SelectProps<any> {
  pageSize?: number;
}

const StatusSelect: FC<IStatusSelectProps> = observer(
  (props) => {
    const field = useField<ArrayField>();
    const prefixCls = 'formily-next-table';
    const errors = field.errors;
    const parseIndex = (address: string) => {
      return Number(address.slice(address.indexOf(field.address.toString()) + 1).match(/(\d+)/)?.[1]);
    };
    const options = props.options?.map(({ label, value }) => {
      const val = Number(value);
      const hasError = errors.some(({ address }) => {
        const currentIndex = parseIndex(address);
        const startIndex = (val - 1) * props.pageSize;
        const endIndex = val * props.pageSize;
        return currentIndex >= startIndex && currentIndex <= endIndex;
      });
      return {
        label: hasError ? <Badge dot>{label}</Badge> : label,
        value,
      };
    });

    const width = String(options?.length).length * 15;

    return (
      <Select
        value={props.value}
        onChange={props.onChange}
        options={options}
        virtual
        style={{
          width: width < 60 ? 60 : width,
        }}
        className={classnames(`${prefixCls}-status-select`, {
          'has-error': errors?.length,
        })}
      />
    );
  },
  {
    scheduler: (update) => {
      clearTimeout(schedulerRequest.request);
      schedulerRequest.request = setTimeout(() => {
        update();
      }, 100);
    },
  },
);

interface IPaginationAction {
  totalPage?: number;
  pageSize?: number;
  changePage?: (page: number) => void;
}

const PaginationContext = createContext<IPaginationAction>({});

interface INextTablePaginationProps extends PaginationProps {
  dataSource?: any[];
  children?: (dataSource: any[], pagination: React.ReactNode) => React.ReactElement;
}

const NextTablePagination: FC<INextTablePaginationProps> = (props) => {
  const [current, setCurrent] = useState(1);
  const prefixCls = 'formily-next-table';
  const pageSize = props.pageSize || 10;
  const size = props.size || 'default';
  const dataSource = props.dataSource || [];
  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;
  const total = dataSource?.length || 0;
  const totalPage = Math.ceil(total / pageSize);
  const pages = Array.from(new Array(totalPage)).map((item, index) => {
    const page = index + 1;
    return {
      label: page,
      value: page,
    };
  });
  const handleChange = (current: number) => {
    setCurrent(current);
  };

  useEffect(() => {
    if (totalPage > 0 && totalPage < current) {
      handleChange(totalPage);
    }
  }, [totalPage, current]);

  const renderPagination = () => {
    if (totalPage <= 1) return;
    return (
      <div className={`${prefixCls}-pagination`}>
        <Space>
          <StatusSelect
            value={current}
            pageSize={pageSize}
            onChange={handleChange}
            options={pages}
            notFoundContent={false}
          />
          <Pagination
            {...props}
            pageSize={pageSize}
            current={current}
            total={dataSource.length}
            size={size}
            showSizeChanger={false}
            onChange={handleChange}
          />
        </Space>
      </div>
    );
  };

  return (
    <Fragment>
      <PaginationContext.Provider value={{ totalPage, pageSize, changePage: handleChange }}>
        {props.children?.(dataSource?.slice(startIndex, endIndex + 1), renderPagination())}
      </PaginationContext.Provider>
    </Fragment>
  );
};

export const NextTable: IComposedNextTable = observer((props: TableProps<any>) => {
  const ref = useRef<HTMLDivElement>();
  const field = useField<ArrayField>();
  const prefixCls = 'formily-next-table';
  const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
  const sources = useNextTableSources();
  const columns = useNextTableColumns(dataSource, field, sources);
  const pagination = isBool(props.pagination) ? {} : props.pagination;
  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record);
  };

  return (
    <NextTablePagination {...pagination} dataSource={dataSource}>
      {(dataSource, pager) => (
        <div ref={ref} className={prefixCls}>
          <ArrayBase>
            <Table
              size="small"
              bordered
              rowKey={defaultRowKey}
              {...props}
              onChange={() => {}}
              pagination={false}
              columns={columns}
              dataSource={dataSource}
            />
            <div style={{ marginTop: 5, marginBottom: 5 }}>{pager}</div>
            {sources.map((column, key) => {
              //专门用来承接对Column的状态管理
              if (!isColumnComponent(column.schema)) return;
              return React.createElement(RecursionField, {
                name: column.name,
                schema: column.schema,
                onlyRenderSelf: true,
                key,
              });
            })}
          </ArrayBase>
        </div>
      )}
    </NextTablePagination>
  );
});

NextTable.displayName = 'NextTable';

NextTable.Column = () => {
  return <Fragment />;
};

ArrayBase.mixin(NextTable);
