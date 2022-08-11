import React from 'react';
import { TreeSelect as FormilyTreeSelect } from '@formily/antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const TreeSelect: DnFC<React.ComponentProps<typeof FormilyTreeSelect>> = FormilyTreeSelect;

TreeSelect.Behavior = createBehavior({
  name: 'TreeSelect',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'TreeSelect',
  designerProps: {
    propsSchema: createFieldSchema({
      component: AllSchemas.TreeSelect,
      valueInputTypes: ['text'],
    }),
  },
  designerLocales: AllLocales.TreeSelect,
});

TreeSelect.Resource = createResource({
  icon: 'TreeSelectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'TreeSelect',
        'x-decorator': 'FormItem',
        'x-component': 'TreeSelect',
      },
    },
  ],
});
