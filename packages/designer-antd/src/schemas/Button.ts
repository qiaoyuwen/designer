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
  },
};
