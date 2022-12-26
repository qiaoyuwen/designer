import { ISchema } from '@formily/react';

export const Collapse: ISchema & { Panel?: ISchema } = {
  type: 'object',
  properties: {},
};

Collapse.Panel = {
  type: 'object',
  properties: {
    header: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
};
