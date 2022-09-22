import React from 'react';
import { Input as FormilyInput } from '@formily/antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Input: DnFC<React.ComponentProps<typeof FormilyInput>> = FormilyInput;

Input.Behavior = createBehavior(
  {
    name: 'Input',
    extends: ['Field'],
    selector: (node) => {
      return node.props?.['x-component'] === 'Input';
    },
    designerProps: {
      propsSchema: createFieldSchema({
        component: AllSchemas.Input,
        valueInputTypes: ['text'],
      }),
    },
    designerLocales: AllLocales.Input,
  },
  {
    name: 'Input.TextArea',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Input.TextArea',
    designerProps: {
      propsSchema: createFieldSchema({
        component: AllSchemas.Input.TextArea,
        valueInputTypes: ['text'],
      }),
    },
    designerLocales: AllLocales.TextArea,
  },
);

Input.Resource = createResource(
  {
    icon: 'InputSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'Input',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
      },
    ],
  },
  {
    icon: 'TextAreaSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'TextArea',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
        },
      },
    ],
  },
);
