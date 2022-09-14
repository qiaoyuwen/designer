import { useMemo } from 'react';
import { createSchemaField } from '@formily/react';
import { Form, Input, FormItem } from '@formily/antd';
import { createForm } from '@formily/core';
import { TextWidget } from '@designer/react';
import { observer } from '@formily/reactive-react';
import { IRequstConfig } from '..';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
  },
});

export interface IRequestSettingFormProps {
  requstConfig: IRequstConfig;
}

export const RequestSettingForm: React.FC<IRequestSettingFormProps> = observer((props) => {
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
          title={<TextWidget token={`SettingComponents.RequestSetter.RequestSettingForm.url`} />}
          x-decorator="FormItem"
          name="url"
          x-component="Input"
        />
      </SchemaField>
    </Form>
  );
});
