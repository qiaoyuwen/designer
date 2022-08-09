/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISchema } from '@formily/react';

export const FormLayout: ISchema = {
  type: 'object',
  properties: {
    labelCol: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    wrapperCol: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    labelWidth: {
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
      'x-component-props': {
        defaultOption: 'auto',
      },
    },
    wrapperWidth: {
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
      'x-component-props': {
        defaultOption: 'auto',
      },
    },
    colon: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'default', ''],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'default',
      },
    },
    layout: {
      type: 'string',
      enum: ['vertical', 'horizontal', 'inline', ''],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'horizontal',
      },
    },
  },
};
