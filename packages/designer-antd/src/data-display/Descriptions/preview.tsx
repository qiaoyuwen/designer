import React from 'react';
import { observer } from '@formily/react';
import { Descriptions as FormilyDescriptions, DescriptionsProps, DescriptionsItemProps } from '@designer/formily-antd';
import { TreeNode, createBehavior, createResource } from '@designer/core';
import { useNodeIdProps, useTreeNode, DroppableWidget, DnFC, TreeNodeWidget } from '@designer/react';
import { LoadTemplate } from '../../common/LoadTemplate';
import { useDropTemplate } from '../../hooks';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { matchComponent } from '../../shared';

const parseDescriptions = (parent: TreeNode) => {
  const descriptions: TreeNode[] = [];
  parent.children.forEach((node) => {
    if (matchComponent(node, 'Descriptions.Item')) {
      descriptions.push(node);
    }
  });
  return descriptions;
};

export const Descriptions: DnFC<DescriptionsProps> & {
  Item?: React.FC<DescriptionsItemProps>;
} = observer((props) => {
  const nodeId = useNodeIdProps();
  const node = useTreeNode();
  const designer = useDropTemplate('Descriptions', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Descriptions.Item',
          'x-component-props': {
            label: '标题',
          },
        },
        children: source,
      }),
    ];
  });
  const descriptions = parseDescriptions(node);
  const renderDescriptions = () => {
    if (!node.children?.length) return <DroppableWidget />;

    return (
      <FormilyDescriptions {...props}>
        {descriptions.map((description) => {
          const props = description.props['x-component-props'] || {};
          props[designer.props.nodeIdAttrName] = description.id;

          return (
            <FormilyDescriptions.Item
              {...props}
              key={description.id}
              label={
                <span data-content-editable="x-component-props.label" data-content-editable-node-id={description.id}>
                  {props.label}
                </span>
              }
            >
              {description.children.length ? (
                <TreeNodeWidget node={description} />
              ) : (
                <DroppableWidget node={description} />
              )}
            </FormilyDescriptions.Item>
          );
        })}
      </FormilyDescriptions>
    );
  };
  return (
    <div {...nodeId}>
      {renderDescriptions()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addItem'),
            icon: 'AddPanel',
            onClick: () => {
              const item = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'Descriptions.Item',
                  'x-component-props': {
                    label: '标题',
                  },
                },
              });
              node.append(item);
            },
          },
        ]}
      />
    </div>
  );
});

Descriptions.Item = (props) => {
  return <FormilyDescriptions.Item {...props} />;
};

Descriptions.Behavior = createBehavior(
  {
    name: 'Descriptions',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Descriptions',
    designerProps: {
      droppable: true,
      allowAppend: (target, sources) => {
        return sources.every((node) => node.props['x-component'] === 'Descriptions.Item');
      },
      propsSchema: createVoidFieldSchema(AllSchemas.Descriptions),
    },
    designerLocales: AllLocales.Descriptions,
  },
  {
    name: 'Descriptions.Item',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Descriptions.Item',
    designerProps: {
      droppable: true,
      allowDrop: (target) => {
        return target.props['x-component'] === 'Descriptions';
      },
      propsSchema: createVoidFieldSchema(AllSchemas.Descriptions.Item),
    },
    designerLocales: AllLocales.DescriptionsItem,
  },
);

Descriptions.Resource = createResource({
  icon: 'TabSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-component': 'Descriptions',
        'x-component-props': {
          bordered: true,
        },
      },
    },
  ],
});
