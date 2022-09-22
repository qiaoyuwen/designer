import React from 'react';
import { BaseLayout as FormilyBaseLayout } from '@designer/formily-antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { withContainer } from '../../common/Container';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const BaseLayout: DnFC<React.ComponentProps<typeof FormilyBaseLayout>> = withContainer(FormilyBaseLayout);

BaseLayout.Behavior = createBehavior({
  name: 'BaseLayout',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'BaseLayout',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.BaseLayout),
  },
  designerLocales: AllLocales.BaseLayout,
});

BaseLayout.Resource = createResource({
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'BaseLayout',
      },
    },
  ],
});
