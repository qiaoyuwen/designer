import { ArrayField, FieldDisplayTypes, GeneralField } from '@formily/core';
import { observer, RecursionField, useField, useFieldSchema } from '@formily/react';
import { Table as AntdTable } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { Fragment, useRef } from 'react';
import { Schema } from '@formily/json-schema';
import { isArr } from '@designer/utils';
import React from 'react';

type IComposedTable = React.FC<React.PropsWithChildren<TableProps<any>>> & {
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

const useTableSources = () => {
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

const useTableColumns = (dataSource: any[], sources: IObservableColumnSource[]): TableProps<any>['columns'] => {
  return sources.reduce((buf, { name, columnProps, schema, display }, key) => {
    if (display !== 'visible') return buf;
    if (!isColumnComponent(schema)) return buf;
    return buf.concat({
      ...columnProps,
      key,
      dataIndex: name,
      render: (value: any, record: any) => {
        const index = dataSource?.indexOf(record);
        const children = <RecursionField schema={schema} name={index} onlyRenderProperties />;
        return children;
      },
    });
  }, []);
};

export const Table: IComposedTable = observer((props: TableProps<any>) => {
  const ref = useRef<HTMLDivElement>();
  const field = useField<ArrayField>();
  const prefixCls = 'formily-next-table';
  const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
  const sources = useTableSources();
  const columns = useTableColumns(dataSource, sources);
  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record);
  };

  return (
    <div ref={ref} className={prefixCls}>
      <AntdTable
        size="small"
        bordered
        rowKey={defaultRowKey}
        {...props}
        onChange={() => {}}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
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
    </div>
  );
});

Table.displayName = 'Table';

Table.Column = () => {
  return <Fragment />;
};
