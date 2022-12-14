/*
 * 支持文本、数字、布尔、表达式
 * Todo: JSON、富文本，公式
 */
import { createSelectionInput, ISelectionInputProps } from '../SelectionInput';
import { Input, Button, InputNumber, Select, Modal } from 'antd';
import { MonacoInput } from '../MonacoInput';
import { TextWidget } from '@designer/react';
import { useState } from 'react';

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
        const [value, setValue] = useState(props.value);
        const [modalVisible, setModalVisible] = useState(false);
        const openModal = () => setModalVisible(true);
        const closeModal = () => setModalVisible(false);

        return (
          <div style={{ width: '100%' }}>
            <Modal
              title="表达式"
              width="65%"
              bodyStyle={{ padding: 10 }}
              visible={modalVisible}
              onCancel={closeModal}
              onOk={() => {
                props.onChange?.(value);
                closeModal();
              }}
            >
              <div
                style={{
                  height: 300,
                }}
              >
                <MonacoInput language="javascript.expression" value={value} onChange={(value) => setValue(value)} />
              </div>
            </Modal>
            <Button block onClick={openModal}>
              <TextWidget token="SettingComponents.ValueInput.expression" />
            </Button>
          </div>
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
  50,
);
