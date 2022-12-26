import { useMemo } from 'react';
import { createSchemaField } from '@formily/react';
import { Form, Input, FormItem, Select } from '@formily/antd';
import { MonacoInput } from '../../../MonacoInput';
import { createForm } from '@formily/core';
import { TextWidget } from '@designer/react';
import { observer } from '@formily/reactive-react';
import { DataType, IRequstConfig } from '../../RequestSetter';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    MonacoInput,
  },
});

export interface IFormDataSettingFormProps {
  requstConfig: IRequstConfig;
}

export const FormDataSettingForm: React.FC<IFormDataSettingFormProps> = observer((props) => {
  const { requstConfig } = props;

  const form = useMemo(() => {
    return createForm({
      values: requstConfig,
    });
  }, [requstConfig]);

  return (
    <Form form={form} labelWidth={150} wrapperWidth={400}>
      <SchemaField>
        <SchemaField.String
          title={<TextWidget token={`SettingComponents.FormDataSetter.FormDataSettingForm.dataType`} />}
          x-decorator="FormItem"
          name="dataType"
          x-component="Select"
          x-component-props={{
            options: [
              {
                label: '静态数据',
                value: DataType.Static,
              },
              {
                label: '动态数据',
                value: DataType.Dynamic,
              },
            ],
          }}
        />
        <SchemaField.String
          title={<TextWidget token={`SettingComponents.FormDataSetter.FormDataSettingForm.url`} />}
          x-decorator="FormItem"
          name="url"
          x-component="Input"
          x-reactions={{
            dependencies: ['dataType'],
            fulfill: {
              state: {
                display: `{{$deps[0] === '${DataType.Dynamic}' ? 'visible': 'none'}}`,
              },
            },
          }}
        />
        <SchemaField.String
          title={<TextWidget token={`SettingComponents.FormDataSetter.FormDataSettingForm.dataSource`} />}
          x-decorator="FormItem"
          name="dataSource"
          x-component="MonacoInput"
          x-component-props={{
            language: 'json',
            width: 600,
            height: 400,
          }}
          x-reactions={{
            dependencies: ['dataType'],
            fulfill: {
              state: {
                display: `{{$deps[0] === '${DataType.Static}' ? 'visible': 'none'}}`,
              },
            },
          }}
        />
      </SchemaField>
    </Form>
  );
});
