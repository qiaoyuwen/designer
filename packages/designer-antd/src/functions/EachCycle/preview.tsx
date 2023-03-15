import { FC, PropsWithChildren, useCallback, useEffect } from 'react';
import { createBehavior, createResource, TreeNode } from '@designer/core';
import { DnFC, DroppableWidget, TreeNodeWidget, useTreeNode } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { observer } from '@formily/react';
import { parseNode } from '../../utils';

export const EachCycle: DnFC<PropsWithChildren> & { Item?: FC<PropsWithChildren> } = observer(() => {
  const node = useTreeNode();
  const item = parseNode(node, 'EachCycle.Item');

  const initItem = useCallback(() => {
    if (!item) {
      const newItem = new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'EachCycle.Item',
        },
      });
      node.append(newItem);
    }
  }, [item, node]);

  useEffect(() => {
    initItem();
  }, [initItem]);

  return <>{item?.children?.length ? <TreeNodeWidget node={item} /> : <DroppableWidget node={item} />}</>;
});

EachCycle.Item = (props) => {
  return <>{props.children}</>;
};

EachCycle.Behavior = createBehavior(
  {
    name: 'EachCycle',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'EachCycle',
    designerProps: {
      droppable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.EachCycle),
    },
    designerLocales: AllLocales.EachCycle,
  },
  {
    name: 'EachCycle.Item',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'EachCycle.Item',
    designerProps: {
      droppable: true,
      draggable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.EachCycle.Item),
    },
    designerLocales: AllLocales.EachCycleItem,
  },
);

EachCycle.Resource = createResource({
  icon: 'Text',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'array',
        'x-component': 'EachCycle',
        'x-component-props': {},
      },
    },
  ],
});
