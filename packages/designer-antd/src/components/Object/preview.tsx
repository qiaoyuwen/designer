import React from 'react';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createVoidFieldSchema } from '../Field';
import { Container } from '../../common/Container';
import { AllLocales } from '../../locales';

export const ObjectContainer: DnFC<React.ComponentProps<typeof Container>> = Container;
ObjectContainer.Behavior = createBehavior({
  name: 'Object',
  extends: ['Field'],
  selector: (node) => node.props.type === 'object',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(),
  },
  designerLocales: AllLocales.ObjectLocale,
});

ObjectContainer.Resource = createResource({
  icon: 'ObjectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
      },
    },
  ],
});
