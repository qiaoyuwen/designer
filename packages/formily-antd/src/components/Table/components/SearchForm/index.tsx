import { useMemo } from 'react';
import { FormItem, FormGrid, Input, Submit, Reset, Select, DatePicker } from '@formily/antd-v5';
import { FormProvider, createSchemaField, observer } from '@formily/react';
import { createForm } from '@formily/core';
import { IProColumnType } from '../../types';
import { ColumnValueType } from '../../enums';

const FormActions = observer(
  (props: {
    count: number;
    maxColumns: number;
    onFormSearchSubmit?: (values: any) => void;
    onFormSearchReset?: () => void;
  }) => {
    const { count, maxColumns, onFormSearchSubmit, onFormSearchReset } = props;
    const lastRowColumns = count % maxColumns;

    return (
      <FormGrid.GridColumn
        gridSpan={maxColumns - lastRowColumns}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Submit onSubmit={onFormSearchSubmit}>查询</Submit>
        <Reset style={{ marginLeft: 8 }} onClick={onFormSearchReset}>
          重置
        </Reset>
      </FormGrid.GridColumn>
    );
  },
);

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormActions,
    Input,
    Select,
    DatePicker,
  },
});

interface ISearchFormProps<DataType> {
  columns?: IProColumnType<DataType>[];
  onFormSearchSubmit?: (values: any) => void;
  onFormSearchReset?: () => void;
}

export const SearchForm = <DataType extends Record<string, any>>(props: ISearchFormProps<DataType>) => {
  const { onFormSearchSubmit, onFormSearchReset } = props;
  const maxColumns = 3;
  const form = useMemo(() => {
    return createForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.columns]);

  const columns = props.columns?.filter((column) => !column.hideInSearch);

  const getSchema = () => {
    const schema = {
      type: 'object',
      properties: {
        layout: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            maxColumns,
            minColumns: maxColumns,
          },
          properties: {},
        },
        actions: {
          type: 'void',
          'x-component': 'FormActions',
          'x-component-props': {
            count: columns.length,
            maxColumns,
            onFormSearchSubmit,
            onFormSearchReset,
          },
        },
      },
    };

    columns.forEach((column) => {
      if (!column.dataIndex && !column.key) {
        return;
      }
      if (column.valueType === ColumnValueType.Select) {
        schema.properties.layout.properties[column.dataIndex || column.key] = {
          type: 'string',
          title: column.title,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: column.valueOptions,
            allowClear: true,
          },
        };
      } else if (column.valueType === ColumnValueType.DateRange) {
        schema.properties.layout.properties[column.dataIndex || column.key] = {
          type: 'string',
          title: column.title,
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker.RangePicker',
        };
      } else {
        schema.properties.layout.properties[column.dataIndex || column.key] = {
          type: 'string',
          title: column.title,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        };
      }
    });

    return schema;
  };

  return (
    <FormProvider form={form}>
      <SchemaField schema={getSchema()} />
    </FormProvider>
  );
};
