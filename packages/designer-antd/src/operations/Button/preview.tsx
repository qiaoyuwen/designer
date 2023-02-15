import React from 'react';
import { Button as FormilyButton } from '@designer/formily-antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Button: DnFC<React.ComponentProps<typeof FormilyButton>> = (props) => {
  return <FormilyButton {...props} onClick={() => {}} actionConfig={undefined} />;
};

Button.Behavior = createBehavior({
  name: 'Button',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Button',
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Button),
  },
  designerLocales: AllLocales.Button,
});

Button.Resource = createResource({
  icon: 'Text',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Button',
        'x-component-props': {
          type: 'primary',
        },
      },
    },
  ],
});
