import { ISchema } from '@formily/react';

export const Button: ISchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    onClick: {
      'x-decorator': 'FormItem',
      'x-component': 'ValueInput',
      'x-component-props': {
        include: ['expression'],
      },
    },
    danger: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'default'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'large',
      },
    },
    type: {
      type: 'string',
      enum: ['primary', '', 'dashed', 'text', 'link'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'primary',
      },
    },
  },
};
