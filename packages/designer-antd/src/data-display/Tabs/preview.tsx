import React, { Fragment, useState } from 'react';
import { observer } from '@formily/react';
import { Tabs as AntdTabs } from 'antd';
import { TabsProps, TabPaneProps } from 'antd/lib/tabs';
import { TreeNode, createBehavior, createResource } from '@designer/core';
import { useNodeIdProps, useTreeNode, TreeNodeWidget, DroppableWidget, DnFC } from '@designer/react';
import { LoadTemplate } from '../../common/LoadTemplate';
import { useDropTemplate } from '../../hooks';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { matchComponent } from '../../shared';

const parseTabs = (parent: TreeNode) => {
  const tabs: TreeNode[] = [];
  parent.children.forEach((node) => {
    if (matchComponent(node, 'Tabs.TabPane')) {
      tabs.push(node);
    }
  });
  return tabs;
};

const getCorrectActiveKey = (activeKey: string, tabs: TreeNode[]) => {
  if (tabs.length === 0) return;
  if (tabs.some((node) => node.id === activeKey)) return activeKey;
  return tabs[0].id;
};

export const Tabs: DnFC<TabsProps> & {
  TabPane?: React.FC<TabPaneProps>;
} = observer((props) => {
  const [activeKey, setActiveKey] = useState<string>();
  const nodeId = useNodeIdProps();
  const node = useTreeNode();
  const designer = useDropTemplate('Tabs', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Tabs.TabPane',
          'x-component-props': {
            tab: `未命名`,
          },
        },
        children: source,
      }),
    ];
  });
  const tabs = parseTabs(node);
  const renderTabs = () => {
    if (!node.children?.length) return <DroppableWidget />;
    return (
      <AntdTabs
        {...props}
        activeKey={getCorrectActiveKey(activeKey, tabs)}
        onChange={(id) => {
          setActiveKey(id);
        }}
      >
        {tabs.map((tab) => {
          const props = tab.props['x-component-props'] || {};
          return (
            <AntdTabs.TabPane
              {...props}
              style={{ ...props.style }}
              tab={
                <span data-content-editable="x-component-props.tab" data-content-editable-node-id={tab.id}>
                  {props.tab}
                </span>
              }
              key={tab.id}
            >
              {React.createElement(
                'div',
                {
                  [designer.props.nodeIdAttrName]: tab.id,
                  style: {
                    padding: '20px 0',
                  },
                },
                tab.children.length ? <TreeNodeWidget node={tab} /> : <DroppableWidget node={tab} />,
              )}
            </AntdTabs.TabPane>
          );
        })}
      </AntdTabs>
    );
  };
  return (
    <div {...nodeId}>
      {renderTabs()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addTabPane'),
            icon: 'AddPanel',
            onClick: () => {
              const tabPane = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'Tabs.TabPane',
                  'x-component-props': {
                    tab: `Unnamed Title`,
                  },
                },
              });
              node.append(tabPane);
              setActiveKey(tabPane.id);
            },
          },
        ]}
      />
    </div>
  );
});

Tabs.TabPane = (props) => {
  return <Fragment>{props.children}</Fragment>;
};

Tabs.Behavior = createBehavior(
  {
    name: 'Tabs',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Tabs',
    designerProps: {
      droppable: true,
      allowAppend: (target, source) =>
        target.children.length === 0 || source.every((node) => node.props['x-component'] === 'Tabs.TabPane'),
      propsSchema: createVoidFieldSchema(AllSchemas.Tabs),
    },
    designerLocales: AllLocales.Tabs,
  },
  {
    name: 'Tabs.TabPane',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Tabs.TabPane',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'Tabs',
      propsSchema: createVoidFieldSchema(AllSchemas.Tabs.TabPane),
    },
    designerLocales: AllLocales.TabsPane,
  },
);

Tabs.Resource = createResource({
  icon: 'TabSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Tabs',
      },
    },
  ],
});
