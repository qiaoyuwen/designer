import { useEffect, useMemo } from 'react';
import { FormItem, FormGrid, Input, Submit, Reset, Select } from '@formily/antd';
import { FormProvider, createSchemaField, observer } from '@formily/react';
import { createForm } from '@formily/core';
import { observable } from '@formily/reactive';
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
  },
});

const form = createForm();

interface ISearchFormProps<DataType> {
  columns?: IProColumnType<DataType>[];
  onFormSearchSubmit?: (values: any) => void;
  onFormSearchReset?: () => void;
}

export const SearchForm = <DataType extends Record<string, any>>(props: ISearchFormProps<DataType>) => {
  const { onFormSearchSubmit, onFormSearchReset } = props;
  const maxColumns = 3;

  const columns = useMemo(() => {
    return props.columns?.filter((column) => !column.hideInSearch);
  }, [props.columns]);

  const renderedItems = useMemo(() => {
    return columns?.map((column) => {
      if (column.valueType === ColumnValueType.Select) {
        return (
          <SchemaField.String
            key={column.dataIndex || column.key}
            name={column.dataIndex}
            title={column.title}
            x-decorator="FormItem"
            x-component="Select"
            x-component-props={{
              options: column.valueOptions,
              allowClear: true,
            }}
          />
        );
      }
      return (
        <SchemaField.String
          key={column.dataIndex || column.key}
          name={column.dataIndex}
          title={column.title}
          x-decorator="FormItem"
          x-component="Input"
        />
      );
    });
  }, [columns]);

  const formActionsProps = useMemo(() => {
    return observable({ count: columns?.length || 0, maxColumns, onFormSearchSubmit, onFormSearchReset });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    formActionsProps.count = columns?.length || 0;
    formActionsProps.maxColumns = maxColumns;
    formActionsProps.onFormSearchSubmit = onFormSearchSubmit;
    formActionsProps.onFormSearchReset = onFormSearchReset;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns?.length, maxColumns, onFormSearchSubmit, onFormSearchReset]);

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
          <SchemaField.Void x-component="FormActions" x-component-props={formActionsProps} />
        </SchemaField.Void>
      </SchemaField>
    </FormProvider>
  );
};
