import React from 'react';
import { FormGrid as FormilyGird } from '@formily/antd-v5';
import { TreeNode, createBehavior, createResource } from '@designer/core';
import { DnFC, useTreeNode, useNodeIdProps, DroppableWidget } from '@designer/react';
import { observer } from '@formily/reactive-react';
import { LoadTemplate } from '../../common/LoadTemplate';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import './styles.less';

type formilyGrid = typeof FormilyGird;

export const Grid: DnFC<React.ComponentProps<formilyGrid>> & {
  GridColumn?: React.FC<React.ComponentProps<formilyGrid['GridColumn']>>;
} = observer((props) => {
  const node = useTreeNode();
  const nodeId = useNodeIdProps();
  if (node.children.length === 0) return <DroppableWidget {...props} />;

  return (
    <div {...nodeId} className="dn-grid">
      <FormilyGird {...props}>{props.children}</FormilyGird>
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addGridColumn'),
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'Grid.GridColumn',
                },
              });
              node.append(column);
            },
          },
        ]}
      />
    </div>
  );
});

Grid.GridColumn = observer(({ gridSpan, ...props }) => {
  return (
    <DroppableWidget {...props} data-grid-span={gridSpan}>
      {props.children}
    </DroppableWidget>
  );
});

Grid.Behavior = createBehavior(
  {
    name: 'Grid',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Grid',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] !== 'Grid',
      propsSchema: createVoidFieldSchema(AllSchemas.Grid),
    },
    designerLocales: AllLocales.Grid,
  },
  {
    name: 'Grid.GridColumn',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Grid.GridColumn',
    designerProps: {
      droppable: true,
      resizable: {
        width(node) {
          const span = Number(node.props['x-component-props']?.gridSpan ?? 1);
          return {
            plus: () => {
              if (span + 1 > 12) return;
              node.props['x-component-props'] = node.props['x-component-props'] || {};
              node.props['x-component-props'].gridSpan = span + 1;
            },
            minus: () => {
              if (span - 1 < 1) return;
              node.props['x-component-props'] = node.props['x-component-props'] || {};
              node.props['x-component-props'].gridSpan = span - 1;
            },
          };
        },
      },
      resizeXPath: 'x-component-props.gridSpan',
      resizeStep: 1,
      resizeMin: 1,
      resizeMax: 12,
      allowDrop: (node) => node.props['x-component'] === 'Grid',
      propsSchema: createVoidFieldSchema(AllSchemas.Grid.GridColumn),
    },
    designerLocales: AllLocales.GridColumn,
  },
);

Grid.Resource = createResource({
  icon: 'GridSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Grid',
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'Grid.GridColumn',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'Grid.GridColumn',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'Grid.GridColumn',
          },
        },
      ],
    },
  ],
});
