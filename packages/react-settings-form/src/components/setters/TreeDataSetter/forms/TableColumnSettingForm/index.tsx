import { useMemo } from 'react';
import { ValueInput } from '../../../../ValueInput';
import { createSchemaField } from '@formily/react';
import { ArrayItems, Form, Input, FormItem, Switch } from '@formily/antd';
import { ITreeDataSource } from '../../types';
import { traverseTree } from '../../shared';
import { createForm, Form as FormCore } from '@formily/core';
import { TextWidget } from '@designer/react';
import { observer } from '@formily/reactive-react';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayItems,
    ValueInput,
    Switch,
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
      <SchemaField>
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
          x-component="ValueInput"
        />
      </SchemaField>
    </Form>
  );
});
