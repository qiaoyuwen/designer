import { Divider as AntdDivider } from 'antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Divider: DnFC<React.ComponentProps<typeof AntdDivider>> = AntdDivider;

Divider.Behavior = createBehavior({
  name: 'Divider',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Divider',
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Divider),
  },
  designerLocales: AllLocales.Divider,
});

Divider.Resource = createResource({
  icon: 'GridSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Divider',
      },
    },
  ],
});
