import { useMemo } from 'react';
import { ValueInput } from '../../../../ValueInput';
import { TableColumnWidthSizeInput } from '../../../../SizeInput';
import { createSchemaField } from '@formily/react';
import { ArrayItems, Form, Input, FormItem, Switch, Select } from '@formily/antd-v5';
import { ITreeDataSource } from '../../types';
import { traverseTree } from '../../shared';
import { createForm, Form as FormCore } from '@formily/core';
import { TextWidget } from '@designer/react';
import { observer } from '@formily/reactive-react';
import { takeMessage } from '@designer/core';
import { DataSourceSetter } from '../../../DataSourceSetter';

enum ColumnValueType {
  Text = 'Text',
  Select = 'Select',
  DateRange = 'DateRange',
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayItems,
    Switch,
    Select,
    TableColumnWidthSizeInput,
  },
});

export interface ITableColumnSettingFormProps {
  treeDataSource: ITreeDataSource;
  effects?: (form: FormCore<any>) => void;
  localeTokenPrefix: string;
}

export const TableColumnSettingForm: React.FC<ITableColumnSettingFormProps> = observer((props) => {
  const { effects, localeTokenPrefix } = props;

  const form = useMemo(() => {
    let values: any;
    traverseTree(props.treeDataSource.dataSource, (dataItem) => {
      if (dataItem.key === props.treeDataSource.selectedKey) {
        values = dataItem;
      }
    });

    return createForm({
      values,
      effects: effects,
    });
  }, [props.treeDataSource.selectedKey, props.treeDataSource.dataSource.length]);

  return (
    <Form form={form} labelWidth={100} wrapperWidth={200}>
      <SchemaField components={{ ValueInput, DataSourceSetter }}>
        <SchemaField.String
          title={<TextWidget token={`${localeTokenPrefix}.title`} />}
          x-decorator="FormItem"
          name="title"
          x-component="Input"
        />
        <SchemaField.String
          title={<TextWidget token={`${localeTokenPrefix}.dataIndex`} />}
          x-decorator="FormItem"
          name="dataIndex"
          x-component="Input"
        />
        <SchemaField.String
          title={<TextWidget token={`${localeTokenPrefix}.valueType`} />}
          x-decorator="FormItem"
          name="valueType"
          x-component="Select"
          x-component-props={{
            options: [
              {
                label: takeMessage(`${localeTokenPrefix}.${ColumnValueType.Text}`),
                value: ColumnValueType.Text,
              },
              {
                label: takeMessage(`${localeTokenPrefix}.${ColumnValueType.Select}`),
                value: ColumnValueType.Select,
              },
              {
                label: takeMessage(`${localeTokenPrefix}.${ColumnValueType.DateRange}`),
                value: ColumnValueType.DateRange,
              },
            ],
          }}
          default={ColumnValueType.Text}
        />
        <SchemaField.Array
          title={<TextWidget token={`${localeTokenPrefix}.valueOptions`} />}
          x-decorator="FormItem"
          name="valueOptions"
          x-component="DataSourceSetter"
          x-reactions={{
            dependencies: ['valueType'],
            fulfill: {
              state: {
                display: `{{$deps[0] === '${ColumnValueType.Select}' ? 'visible' : 'hidden'}}`,
              },
            },
          }}
          default={[]}
        />
        <SchemaField.String
          title={<TextWidget token={`${localeTokenPrefix}.width`} />}
          x-decorator="FormItem"
          name="width"
          x-component="TableColumnWidthSizeInput"
          x-component-props={{
            defaultOption: 'undefined',
          }}
        />
        <SchemaField.String
          title={<TextWidget token={`${localeTokenPrefix}.hideInSearch`} />}
          x-decorator="FormItem"
          name="hideInSearch"
          x-component="Switch"
        />
        <SchemaField.String
          title={<TextWidget token={`${localeTokenPrefix}.render`} />}
          x-decorator="FormItem"
          name="render"
          x-component="ValueInput"
          x-component-props={{
            include: ['expression'],
          }}
        />
      </SchemaField>
    </Form>
  );
});
