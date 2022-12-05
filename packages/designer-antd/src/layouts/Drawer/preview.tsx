import { useRef } from 'react';
import { Drawer as FormilyAntdDrawer } from '@designer/formily-antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC, useNodeIdProps } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Drawer: DnFC<React.ComponentProps<typeof FormilyAntdDrawer>> = (props) => {
  const nodeId = useNodeIdProps();
  const containerRef = useRef<HTMLDivElement>();

  return (
    <div ref={containerRef} {...nodeId}>
      <FormilyAntdDrawer
        {...props}
        visible={true}
        title={<span data-content-editable="x-component-props.title">{props.title}</span>}
        getContainer={() => {
          return containerRef.current;
        }}
      >
        {props.children}
      </FormilyAntdDrawer>
    </div>
  );
};

Drawer.Behavior = createBehavior({
  name: 'Drawer',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Drawer',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Drawer),
  },
  designerLocales: AllLocales.Drawer,
});

Drawer.Resource = createResource({
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Drawer',
        'x-component-props': {
          title: 'Title',
        },
      },
      containerClassName: '.ant-drawer-content-wrapper',
    },
  ],
});
