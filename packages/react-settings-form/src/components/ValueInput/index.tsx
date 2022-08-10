/*
 * 支持文本、数字、布尔、表达式
 * Todo: JSON、富文本，公式
 */
import { createSelectionInput, ISelectionInputProps } from '../SelectionInput';
import { Input, Button, Popover, InputNumber, Select } from 'antd';
import { MonacoInput } from '../MonacoInput';
import { TextWidget } from '@designer/react';

const STARTTAG_REX =
  /<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;

const EXPRESSION_REX = /^\{\{([\s\S]*)\}\}$/;

const isNumber = (value: any) => typeof value === 'number';

const isBoolean = (value: any) => typeof value === 'boolean';

const isExpression = (value: any) => {
  return typeof value === 'string' && EXPRESSION_REX.test(value);
};

const isRichText = (value: any) => {
  return typeof value === 'string' && STARTTAG_REX.test(value);
};

const isNormalText = (value: any) => {
  return typeof value === 'string' && !isExpression(value) && !isRichText(value);
};

const takeNumber = (value: any) => {
  const num = String(value).replace(/[^\d\.]+/, '');
  if (num === '') return;
  return Number(num);
};

export const ValueInput: React.FC<ISelectionInputProps> = createSelectionInput(
  [
    {
      value: 'text',
      component: Input,
      checker: isNormalText,
    },
    {
      value: 'number',
      component: InputNumber,
      checker: isNumber,
      toInputValue: takeNumber,
      toChangeValue: takeNumber,
    },
    {
      value: 'boolean',
      component: (props: any) => (
        <Select
          {...props}
          options={[
            { label: 'True', value: true },
            { label: 'False', value: false },
          ]}
        />
      ),
      checker: isBoolean,
      toInputValue: (value) => {
        return !!value;
      },
      toChangeValue: (value) => {
        return !!value;
      },
    },
    {
      value: 'expression',
      component: (props: any) => {
        return (
          <Popover
            content={
              <div
                style={{
                  width: 400,
                  height: 200,
                  marginLeft: -16,
                  marginRight: -16,
                  marginBottom: -12,
                }}
              >
                <MonacoInput {...props} language="javascript.expression" />
              </div>
            }
            trigger="click"
          >
            <Button block>
              <TextWidget token="SettingComponents.ValueInput.expression" />
            </Button>
          </Popover>
        );
      },
      checker: isExpression,
      toInputValue: (value: any) => {
        if (!value || value === '{{}}') return;
        const matched = String(value).match(EXPRESSION_REX);
        return matched?.[1] || value || '';
      },
      toChangeValue: (value) => {
        if (!value || value === '{{}}') return;
        const matched = String(value).match(EXPRESSION_REX);
        return `{{${matched?.[1] || value || ''}}}`;
      },
    },
  ],
  65,
);
