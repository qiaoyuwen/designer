import React from 'react';
import { Tooltip as AntdTooltip } from 'antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { withContainer } from '../../common/Container';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Tooltip: DnFC<React.ComponentProps<typeof AntdTooltip>> = withContainer(AntdTooltip);

Tooltip.Behavior = createBehavior({
  name: 'Tooltip',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Tooltip',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Tooltip),
  },
  designerLocales: AllLocales.Tooltip,
});

Tooltip.Resource = createResource({
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Tooltip',
      },
    },
  ],
});
