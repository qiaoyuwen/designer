import React, { useCallback, useEffect } from 'react';
import { Card as FormilyAntdCard } from '@designer/formily-antd';
import { createBehavior, createResource, TreeNode } from '@designer/core';
import { DnFC, DroppableWidget, TreeNodeWidget, useTreeNode } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { matchComponent } from '../../shared';
import { observer } from '@formily/react';

const parseNode = (parent: TreeNode, name: string) => {
  let result: TreeNode;
  parent.children.forEach((node) => {
    if (matchComponent(node, name)) {
      result = node;
    }
  });
  return result;
};

export const Card: DnFC<React.ComponentProps<typeof FormilyAntdCard>> = observer((props) => {
  const node = useTreeNode();
  const body = parseNode(node, 'Card.Body');
  const extra = parseNode(node, 'Card.Extra');

  const initBody = useCallback(() => {
    if (!body) {
      const newBody = new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Card.Body',
        },
      });
      node.append(newBody);
    }
  }, [body, node]);

  const initExtra = useCallback(() => {
    if (!extra) {
      const newExtra = new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Card.Extra',
        },
      });
      node.append(newExtra);
    }
  }, [extra, node]);

  useEffect(() => {
    initBody();
    initExtra();
  }, [initBody, initExtra]);

  return (
    <FormilyAntdCard
      {...props}
      title={<span data-content-editable="x-component-props.title">{props.title}</span>}
      extra={
        <FormilyAntdCard.Extra>
          {extra?.children?.length ? <TreeNodeWidget node={extra} /> : <DroppableWidget node={extra} />}
        </FormilyAntdCard.Extra>
      }
    >
      <FormilyAntdCard.Body>
        {body?.children?.length ? <TreeNodeWidget node={body} /> : <DroppableWidget node={body} />}
      </FormilyAntdCard.Body>
    </FormilyAntdCard>
  );
});

Card.Behavior = createBehavior(
  {
    name: 'Card',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Card',
    designerProps: {
      propsSchema: createVoidFieldSchema(AllSchemas.Card),
    },
    designerLocales: AllLocales.Card,
  },
  {
    name: 'Card.Body',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Card.Body',
    designerProps: {
      droppable: true,
      draggable: false,
      deletable: false,
      cloneable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.Card.Body),
    },
    designerLocales: AllLocales.CardBody,
  },
  {
    name: 'Card.Extra',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Card.Extra',
    designerProps: {
      droppable: true,
      draggable: false,
      deletable: false,
      cloneable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.Card.Extra),
    },
    designerLocales: AllLocales.CardExtra,
  },
);

Card.Resource = createResource({
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: 'Title',
        },
      },
    },
  ],
});
