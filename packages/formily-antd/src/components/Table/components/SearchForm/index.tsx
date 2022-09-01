import { useMemo } from 'react';
import { FormItem, FormGrid, Input, Submit, Reset } from '@formily/antd';
import { FormProvider, createSchemaField } from '@formily/react';
import { createForm } from '@formily/core';
import { IProColumnType } from '../../types';

const FormActions = (props: { count: number; maxColumns: number }) => {
  const { count, maxColumns } = props;
  const lastRowColumns = count % maxColumns;

  return (
    <FormGrid.GridColumn
      gridSpan={maxColumns - lastRowColumns}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Submit onSubmit={console.log}>查询</Submit>
      <Reset style={{ marginLeft: 8 }}>重置</Reset>
    </FormGrid.GridColumn>
  );
};

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormActions,
    Input,
  },
});

const form = createForm();

interface ISearchFormProps<DataType> {
  columns?: IProColumnType<DataType>[];
}

export const SearchForm = <DataType extends Record<string, any>>(props: ISearchFormProps<DataType>) => {
  const { columns } = props;
  const maxColumns = 3;

  const renderedItems = useMemo(() => {
    return columns?.map((column) => {
      return (
        <SchemaField.String
          key={column.dataIndex}
          name={column.dataIndex}
          title={column.title}
          x-decorator="FormItem"
          x-component="Input"
        />
      );
    });
  }, [columns]);

  return (
    <FormProvider form={form}>
      <SchemaField>
        <SchemaField.Void
          x-component="FormGrid"
          x-component-props={{
            maxColumns,
            minColumns: maxColumns,
          }}
        >
          {renderedItems}
          <SchemaField.Void x-component="FormActions" x-component-props={{ count: columns?.length || 0, maxColumns }} />
        </SchemaField.Void>
      </SchemaField>
    </FormProvider>
  );
};
