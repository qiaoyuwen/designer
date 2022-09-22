import React from 'react';
import { Select as FormilySelect } from '@formily/antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Select: DnFC<React.ComponentProps<typeof FormilySelect>> = FormilySelect;

Select.Behavior = createBehavior({
  name: 'Select',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Select',
  designerProps: {
    propsSchema: createFieldSchema({
      component: AllSchemas.Select,
      valueInputTypes: ['text', 'number'],
    }),
  },
  designerLocales: AllLocales.Select,
});

Select.Resource = createResource({
  icon: 'SelectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Select',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
    },
  ],
});
