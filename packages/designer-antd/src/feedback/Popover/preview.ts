import React from 'react';
import { Popover as AntdPopover } from 'antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { withContainer } from '../../common/Container';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Popover: DnFC<React.ComponentProps<typeof AntdPopover>> = withContainer(AntdPopover);

Popover.Behavior = createBehavior({
  name: 'Popover',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Popover',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Popover),
  },
  designerLocales: AllLocales.Popover,
});

Popover.Resource = createResource({
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Popover',
      },
    },
  ],
});
