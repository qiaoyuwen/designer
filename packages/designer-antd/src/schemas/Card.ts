import { ISchema } from '@formily/react';

export const Card: ISchema & { Title?: ISchema; Body?: ISchema; Extra?: ISchema } = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['', 'inner'],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: '',
        optionType: 'button',
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

Card.Title = {
  type: 'object',
  properties: {},
};

Card.Body = {
  type: 'object',
  properties: {},
};

Card.Extra = {
  type: 'object',
  properties: {},
};
