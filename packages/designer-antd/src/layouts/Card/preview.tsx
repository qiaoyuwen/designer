import React, { useCallback, useEffect } from 'react';
import { Card as FormilyAntdCard } from '@designer/formily-antd';
import { createBehavior, createResource, TreeNode } from '@designer/core';
import { DnFC, DroppableWidget, TreeNodeWidget, useTreeNode } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { observer } from '@formily/react';
import { parseNode } from '../../utils';

export const Card: DnFC<React.ComponentProps<typeof FormilyAntdCard>> = observer((props) => {
  const node = useTreeNode();
  const title = parseNode(node, 'Card.Title');
  const body = parseNode(node, 'Card.Body');
  const extra = parseNode(node, 'Card.Extra');

  const initTitle = useCallback(() => {
    if (!title) {
      const newTitle = new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Card.Title',
        },
      });
      const defaultText = new TreeNode({
        componentName: 'Field',
        props: {
          type: 'string',
          'x-component': 'Text',
          'x-component-props': {
            text: '标题',
          },
        },
      });
      newTitle.append(defaultText);
      node.append(newTitle);
    }
  }, [title, node]);

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
    initTitle();
    initBody();
    initExtra();
  }, [initTitle, initBody, initExtra]);

  return (
    <FormilyAntdCard
      {...props}
      title={
        <FormilyAntdCard.Title>
          {title?.children?.length ? <TreeNodeWidget node={title} /> : <DroppableWidget node={title} />}
        </FormilyAntdCard.Title>
      }
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
    name: 'Card.Title',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Card.Title',
    designerProps: {
      droppable: true,
      draggable: false,
      deletable: false,
      cloneable: false,
      hideable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.Card.Title),
    },
    designerLocales: AllLocales.CardTitle,
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
      hideable: false,
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
      hideable: false,
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
