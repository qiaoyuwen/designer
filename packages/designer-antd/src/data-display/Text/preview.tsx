import React from 'react';
import { Text as FormilyText } from '@designer/formily-antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import cls from 'classnames';
import './styles.less';

export const Text: DnFC<React.ComponentProps<typeof FormilyText>> = (props) => {
  return (
    <FormilyText
      {...props}
      className={cls(props.className, 'dn-text')}
      data-content-editable="x-component-props.title"
    />
  );
};

Text.Behavior = createBehavior({
  name: 'Text',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Text',
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Text),
  },
  designerLocales: AllLocales.Text,
});

Text.Resource = createResource({
  icon: 'TextSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        'x-component': 'Text',
      },
    },
  ],
});
