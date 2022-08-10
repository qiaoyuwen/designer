import React from 'react';
import { Password as FormilyPassword } from '@formily/antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Password: DnFC<React.ComponentProps<typeof FormilyPassword>> = FormilyPassword;

Password.Behavior = createBehavior({
  name: 'Password',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Password',
  designerProps: {
    propsSchema: createFieldSchema({
      component: AllSchemas.Password,
      valueInputTypes: ['text'],
    }),
  },
  designerLocales: AllLocales.Password,
});

Password.Resource = createResource({
  icon: 'PasswordSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Password',
        'x-decorator': 'FormItem',
        'x-component': 'Password',
      },
    },
  ],
});
