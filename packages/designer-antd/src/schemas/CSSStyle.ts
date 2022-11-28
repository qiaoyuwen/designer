import { ISchema } from '@formily/react';

export const CSSStyle: ISchema = {
  type: 'void',
  properties: {
    'style.position': {
      'x-component': 'PositionStyleSetter',
    },
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
    'style.background': {
      'x-component': 'BackgroundStyleSetter',
    },
    'style.boxShadow': {
      'x-component': 'BoxShadowStyleSetter',
    },
    'style.font': {
      'x-component': 'FontStyleSetter',
    },
    'style.border': {
      'x-component': 'BorderStyleSetter',
    },
    'style.borderRadius': {
      'x-component': 'BorderRadiusStyleSetter',
    },
    'style.opacity': {
      'x-decorator': 'FormItem',
      'x-component': 'Slider',
      'x-component-props': {
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  },
};
