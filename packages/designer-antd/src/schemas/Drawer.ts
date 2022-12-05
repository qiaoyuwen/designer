import { ISchema } from '@formily/react';

export const Drawer: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    width: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
  },
};
