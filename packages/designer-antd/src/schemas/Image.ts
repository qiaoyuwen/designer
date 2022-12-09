import { ISchema } from '@formily/react';

export const Image: ISchema & { PreviewGroup?: ISchema } = {
  type: 'object',
  properties: {
    src: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    width: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ValueInput',
      'x-component-props': {
        include: ['number', 'text'],
        defaultOption: 'number',
      },
      default: 200,
    },
    height: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ValueInput',
      'x-component-props': {
        include: ['number', 'text'],
        defaultOption: 'number',
      },
      default: 200,
    },
  },
};

Image.PreviewGroup = {
  type: 'object',
  properties: {},
};
