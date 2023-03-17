import { ISchema } from '@formily/react';

export const NumberPicker: ISchema = {
  type: 'object',
  properties: {
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    precision: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    max: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    min: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    step: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'middle', ''],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'middle',
      },
    },
    bordered: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
  },
};
