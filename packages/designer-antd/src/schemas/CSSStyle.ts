import { ISchema } from '@formily/react';

export const CSSStyle: ISchema = {
  type: 'void',
  properties: {
    'style.width': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
      'x-component-props': {
        defaultOption: 'inherit',
      },
    },
    'style.height': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
      'x-component-props': {
        defaultOption: 'inherit',
      },
    },
    'style.display': {
      'x-component': 'DisplayStyleSetter',
    },
    'style.margin': {
      'x-component': 'BoxStyleSetter',
    },
    'style.padding': {
      'x-component': 'BoxStyleSetter',
    },
    'style.font': {
      'x-component': 'FontStyleSetter',
    },
  },
};
