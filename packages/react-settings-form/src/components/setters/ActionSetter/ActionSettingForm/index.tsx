import { useContext, useMemo } from 'react';
import { createSchemaField } from '@formily/react';
import { Form, Input, FormItem, Select } from '@formily/antd';
import { MonacoInput } from '../../../MonacoInput';
import { createForm } from '@formily/core';
import { observer } from '@formily/reactive-react';
import { ActionConfigType, ActionType, IActionConfig } from '..';
import { SettingsFormContext } from '../../../../shared/context';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    MonacoInput,
  },
});

export interface IActionSettingFormProps {
  actionConfig: IActionConfig;
}

export const ActionSettingForm: React.FC<IActionSettingFormProps> = observer((props) => {
  const { actionConfig } = props;

  const { pageOptions } = useContext(SettingsFormContext);

  const form = useMemo(() => {
    return createForm({
      values: actionConfig,
    });
  }, [actionConfig]);

  return (
    <Form form={form} labelWidth={150} wrapperWidth={400}>
      <SchemaField>
        <SchemaField.String
          title="配置类型"
          x-decorator="FormItem"
          name="actionConfigType"
          x-component="Select"
          x-component-props={{
            options: [
              {
                label: '已存在配置',
                value: ActionConfigType.Enum,
              },
              {
                label: '自定义配置',
                value: ActionConfigType.Custom,
              },
            ],
          }}
        />
        <SchemaField.Object
          name="config"
          x-reactions={{
            dependencies: ['actionConfigType'],
            fulfill: {
              state: {
                display: `{{$deps[0] === '${ActionConfigType.Enum}' ? 'visible': 'none'}}`,
              },
            },
          }}
        >
          <SchemaField.String
            title="动作类型"
            x-decorator="FormItem"
            name="actionType"
            x-component="Select"
            x-component-props={{
              options: [
                {
                  label: '跳转页面',
                  value: ActionType.JumpPage,
                },
              ],
            }}
          />
          <SchemaField.Object
            name="params"
            x-reactions={{
              dependencies: ['config.actionType'],
              fulfill: {
                state: {
                  display: `{{$deps[0] === '${ActionType.JumpPage}' ? 'visible': 'none'}}`,
                },
              },
            }}
          >
            <SchemaField.String
              title="跳转页面页面"
              x-decorator="FormItem"
              name="pageId"
              x-component="Select"
              x-component-props={{
                options: pageOptions,
              }}
            />
          </SchemaField.Object>
        </SchemaField.Object>

        <SchemaField.String
          title="表达式"
          x-decorator="FormItem"
          name="customFunc"
          x-component="MonacoInput"
          x-component-props={{
            language: 'javascript.expression',
            width: 600,
            height: 400,
          }}
          x-reactions={{
            dependencies: ['actionConfigType'],
            fulfill: {
              state: {
                display: `{{$deps[0] === '${ActionConfigType.Custom}' ? 'visible': 'none'}}`,
              },
            },
          }}
        />
      </SchemaField>
    </Form>
  );
});
