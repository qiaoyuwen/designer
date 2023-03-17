import { FC, useMemo } from 'react';
import { Field, FormProvider } from '@formily/react';
import { createForm } from '@formily/core';
import { DatePicker, FormGrid, FormItem, Input, Reset, Select, Submit } from '@formily/antd-v5';
import { Card } from 'antd';
import { TreeNode } from '@designer/core';
import { observer } from '@formily/reactive-react';

interface ISearchFormProps {
  columns?: TreeNode[];
}

export const SearchForm: FC<ISearchFormProps> = observer(({ columns: originColumns = [] }) => {
  const columns = useMemo(() => {
    return originColumns.filter((column) => !column.props['x-component-props']?.hideInSearch);
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
          {columns.map((item) => {
            const componentProps = item.props['x-component-props'];
            const name = componentProps?.name || item.id;

            if (componentProps.type === 'Select') {
              return (
                <Field
                  key={name}
                  name={name}
                  title={componentProps.title}
                  decorator={[FormItem]}
                  component={[
                    Select,
                    {
                      options: [],
                      allowClear: true,
                    },
                  ]}
                />
              );
            } else if (componentProps.type === 'DateRange') {
              return (
                <Field
                  key={name}
                  name={name}
                  title={componentProps.title}
                  decorator={[FormItem]}
                  component={[DatePicker.RangePicker]}
                />
              );
            } else {
              return (
                <Field key={name} name={name} title={componentProps.title} decorator={[FormItem]} component={[Input]} />
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
});
