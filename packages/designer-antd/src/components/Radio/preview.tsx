import React from 'react';
import { Radio as FormilyRadio } from '@formily/antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Radio: DnFC<React.ComponentProps<typeof FormilyRadio>> = FormilyRadio;

Radio.Behavior = createBehavior({
  name: 'Radio.Group',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Radio.Group',
  designerProps: {
    propsSchema: createFieldSchema({
      component: AllSchemas.Radio.Group,
      valueInputTypes: ['text', 'number'],
      dataSource: true,
    }),
  },
  designerLocales: AllLocales.RadioGroup,
});

Radio.Resource = createResource({
  icon: 'RadioGroupSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string | number',
        title: 'Radio Group',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        enum: [
          { label: '选项1', value: 1 },
          { label: '选项2', value: 2 },
        ],
      },
    },
  ],
});
