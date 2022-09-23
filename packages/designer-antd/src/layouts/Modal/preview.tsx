import { Modal as AntdModal } from 'antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Modal: DnFC<React.ComponentProps<typeof AntdModal>> = (props) => {
  return (
    <AntdModal
      {...props}
      title={<span data-content-editable="x-component-props.title">{props.title}</span>}
      getContainer={() => {
        return document.querySelector('.dn-component-tree > .dn-designable-form > form');
      }}
    >
      {props.children}
    </AntdModal>
  );
};

Modal.Behavior = createBehavior({
  name: 'Card',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Modal',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Modal),
  },
  designerLocales: AllLocales.Modal,
});

Modal.Resource = createResource({
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Modal',
        'x-component-props': {
          title: 'Title',
        },
      },
    },
  ],
});
