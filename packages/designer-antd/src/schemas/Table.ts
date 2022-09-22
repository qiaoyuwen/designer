import { ISchema } from '@formily/react';

export const Table: ISchema & { Addition?: ISchema } = {
  type: 'object',
  properties: {
    columns: {
      'x-decorator': 'FormItem',
      'x-component': 'TableColumnsSetter',
    },
    requestConifg: {
      'x-decorator': 'FormItem',
      'x-component': 'RequestSetter',
    },
  },
};
