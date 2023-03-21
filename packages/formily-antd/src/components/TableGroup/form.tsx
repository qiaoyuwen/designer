import { FC, useMemo } from 'react';
import { Field, FormProvider } from '@formily/react';
import { createForm } from '@formily/core';
import { DatePicker, FormGrid, FormItem, Input, Reset, Select, Submit } from '@formily/antd-v5';
import { Card } from 'antd';
import { ColumnType as AntdColumnType } from 'antd/lib/table';

type ColumnType = AntdColumnType<any> & {
  type?: 'Select' | 'DateRange';
  options?: {
    label: string;
    value: string | number;
  }[];
  hideInSearch?: boolean;
};

interface ISearchFormProps {
  columns?: ColumnType[];
}

export const SearchForm: FC<ISearchFormProps> = ({ columns: originColumns = [] }) => {
  const columns = useMemo(() => {
    return originColumns.filter((column) => !column?.hideInSearch);
  }, [originColumns]);
  const maxColumns = 3;
  const lastRowColumns = columns.length % maxColumns;
  const form = useMemo(() => {
    return createForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  return (
    <Card style={{ marginBottom: 24 }}>
      <FormProvider form={form}>
        <FormGrid maxColumns={maxColumns} minColumns={maxColumns}>
          {columns.map((column) => {
            const dataIndex = column.dataIndex as string;
            const { title, type, options } = column;
            if (type === 'Select') {
              return (
                <Field
                  key={dataIndex}
                  name={dataIndex}
                  title={title}
                  decorator={[FormItem]}
                  component={[
                    Select,
                    {
                      options,
                      allowClear: true,
                    },
                  ]}
                />
              );
            } else if (type === 'DateRange') {
              return (
                <Field
                  key={dataIndex}
                  name={dataIndex}
                  title={title}
                  decorator={[FormItem]}
                  component={[DatePicker.RangePicker]}
                />
              );
            } else {
              return (
                <Field key={dataIndex} name={dataIndex} title={title} decorator={[FormItem]} component={[Input]} />
              );
            }
          })}
          <FormGrid.GridColumn
            gridSpan={maxColumns - lastRowColumns}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Submit onSubmit={() => {}}>查询</Submit>
            <Reset style={{ marginLeft: 8 }} onClick={() => {}}>
              重置
            </Reset>
          </FormGrid.GridColumn>
        </FormGrid>
      </FormProvider>
    </Card>
  );
};
