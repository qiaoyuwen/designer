import React, { Fragment, useState } from 'react';
import { observer } from '@formily/react';
import { Collapse as AntdCollapse, CollapseProps, CollapsePanelProps } from 'antd';
import { TreeNode, createBehavior, createResource } from '@designer/core';
import { useNodeIdProps, useTreeNode, TreeNodeWidget, DroppableWidget, DnFC } from '@designer/react';
import { LoadTemplate } from '../../common/LoadTemplate';
import { useDropTemplate } from '../../hooks';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { matchComponent } from '../../shared';

const parseCollapses = (parent: TreeNode) => {
  const collapses: TreeNode[] = [];
  parent.children.forEach((node) => {
    if (matchComponent(node, 'Collapse.Panel')) {
      collapses.push(node);
    }
  });
  return collapses;
};

const getCorrectActiveKey = (activeKey: string, collapses: TreeNode[]) => {
  if (collapses.length === 0) return;
  if (collapses.some((node) => node.id === activeKey)) return activeKey;
  return collapses[0].id;
};

export const Collapse: DnFC<CollapseProps> & {
  Panel?: React.FC<CollapsePanelProps>;
} = observer((props) => {
  const [activeKey, setActiveKey] = useState<string>();
  const nodeId = useNodeIdProps();
  const node = useTreeNode();
  const designer = useDropTemplate('Collapse', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Collapse.Panel',
          'x-component-props': {
            header: `标题`,
          },
        },
        children: source,
      }),
    ];
  });
  const collapses = parseCollapses(node);
  const renderCollapses = () => {
    if (!node.children?.length) return <DroppableWidget />;
    return (
      <AntdCollapse
        {...props}
        activeKey={getCorrectActiveKey(activeKey, collapses)}
        onChange={(id) => {
          setActiveKey(id as string);
        }}
      >
        {collapses.map((collapse) => {
          const props = collapse.props['x-component-props'] || {};
          return (
            <AntdCollapse.Panel {...props} key={collapse.id}>
              {React.createElement(
                'div',
                {
                  [designer.props.nodeIdAttrName]: collapse.id,
                  style: {
                    padding: '20px 0',
                  },
                },
                collapse.children.length ? <TreeNodeWidget node={collapse} /> : <DroppableWidget node={collapse} />,
              )}
            </AntdCollapse.Panel>
          );
        })}
      </AntdCollapse>
    );
  };
  return (
    <div {...nodeId}>
      {renderCollapses()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addPanel'),
            icon: 'AddPanel',
            onClick: () => {
              const item = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'Collapse.Panel',
                  'x-component-props': {
                    header: `标题`,
                  },
                },
              });
              node.append(item);
              setActiveKey(item.id);
            },
          },
        ]}
      />
    </div>
  );
});

Collapse.Panel = (props) => {
  return <Fragment>{props.children}</Fragment>;
};

Collapse.Behavior = createBehavior(
  {
    name: 'Collapse',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Collapse',
    designerProps: {
      droppable: true,
      allowAppend: (target, source) =>
        target.children.length === 0 || source.every((node) => node.props['x-component'] === 'Collapse.Panel'),
      propsSchema: createVoidFieldSchema(AllSchemas.Collapse),
    },
    designerLocales: AllLocales.Collapse,
  },
  {
    name: 'Collapse.Panel',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Collapse.Panel',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'Collapse',
      propsSchema: createVoidFieldSchema(AllSchemas.Collapse.Panel),
    },
    designerLocales: AllLocales.CollapsePanel,
  },
);

Collapse.Resource = createResource({
  icon: 'TabSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Collapse',
        'x-component-props': {
          accordion: true,
        },
      },
    },
  ],
});
