import { useMemo } from 'react';
import { createSchemaField } from '@formily/react';
import { Form, Input, FormItem, Switch, Select } from '@formily/antd';
import { ITreeDataSource } from '../../types';
import { traverseTree } from '../../shared';
import { createForm, Form as FormCore } from '@formily/core';
import { TextWidget } from '@designer/react';
import { observer } from '@formily/reactive-react';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Switch,
    Select,
  },
});

export interface IRouterSettingFormProps {
  treeDataSource: ITreeDataSource;
  effects?: (form: FormCore<any>) => void;
  localeTokenPrefix: string;
  childrenKey: string;
  pageOptions?: { value: string; label: string }[];
}

export const RouterSettingForm: React.FC<IRouterSettingFormProps> = observer((props) => {
  const { effects, localeTokenPrefix, childrenKey, pageOptions } = props;

  const { form, dataItem } = useMemo(() => {
    let values: any;
    traverseTree(
      props.treeDataSource.dataSource,
      (dataItem) => {
        if (dataItem.key === props.treeDataSource.selectedKey) {
          values = dataItem;
        }
      },
      childrenKey,
    );

    return {
      form: createForm({
        values,
        effects: effects,
      }),
      dataItem: values,
    };
  }, [props.treeDataSource.selectedKey, props.treeDataSource.dataSource.length]);

  return (
    <Form form={form} labelWidth={100} wrapperWidth={200}>
      <SchemaField>
        <SchemaField.String
          title={<TextWidget token={`${localeTokenPrefix}.name`} />}
          x-decorator="FormItem"
          name="name"
          x-component="Input"
        />
        <SchemaField.String
          title={<TextWidget token={`${localeTokenPrefix}.path`} />}
          x-decorator="FormItem"
          name="path"
          x-component="Input"
        />
        {(!dataItem.children || dataItem.children.length === 0) && (
          <>
            <SchemaField.String
              title={<TextWidget token={`${localeTokenPrefix}.pageId`} />}
              x-decorator="FormItem"
              name="pageId"
              x-component="Select"
              x-component-props={{
                allowClear: true,
                options: pageOptions || [],
              }}
            />
            <SchemaField.Boolean
              name="layout"
              title={<TextWidget token={`${localeTokenPrefix}.layout`} />}
              x-decorator="FormItem"
              x-component="Switch"
              default={true}
            />
          </>
        )}
        <SchemaField.Boolean
          name="hideInMenu"
          title={<TextWidget token={`${localeTokenPrefix}.hideInMenu`} />}
          x-decorator="FormItem"
          x-component="Switch"
        />
      </SchemaField>
    </Form>
  );
});
