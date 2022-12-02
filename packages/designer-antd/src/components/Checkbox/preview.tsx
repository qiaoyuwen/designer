import React from 'react';
import { Checkbox as FormilyCheckbox } from '@formily/antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Checkbox: DnFC<React.ComponentProps<typeof FormilyCheckbox>> = FormilyCheckbox;

Checkbox.Behavior = createBehavior({
  name: 'Checkbox.Group',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Checkbox.Group',
  designerProps: {
    propsSchema: createFieldSchema({
      component: AllSchemas.Checkbox.Group,
      valueInputTypes: ['text', 'number'],
      dataSource: true,
    }),
  },
  designerLocales: AllLocales.CheckboxGroup,
});

Checkbox.Resource = createResource({
  icon: 'CheckboxGroupSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'Array<string | number>',
        title: 'Checkbox Group',
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox.Group',
        enum: [
          { label: '选项1', value: 1 },
          { label: '选项2', value: 2 },
        ],
      },
    },
  ],
});
