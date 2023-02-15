import { ISchema } from '@formily/react';

export const Steps: ISchema & {
  Step?: ISchema & {
    Title?: ISchema;
    SubTitle?: ISchema;
    Description?: ISchema;
  };
} = {
  type: 'object',
  properties: {
    current: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 0,
    },
    progressDot: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    direction: {
      type: 'string',
      enum: ['horizontal', 'vertical'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'vertical',
      },
    },
  },
};

Steps.Step = {
  type: 'object',
  properties: {},
};

Steps.Step.Title = {
  type: 'object',
  properties: {},
};

Steps.Step.SubTitle = {
  type: 'object',
  properties: {},
};

Steps.Step.Description = {
  type: 'object',
  properties: {},
};
