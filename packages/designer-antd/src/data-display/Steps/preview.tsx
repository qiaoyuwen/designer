import React from 'react';
import { observer } from '@formily/react';
import { Steps as AntdSteps } from 'antd';
import { StepsProps, StepProps } from 'antd/lib/steps';
import { TreeNode, createBehavior, createResource } from '@designer/core';
import { useNodeIdProps, useTreeNode, TreeNodeWidget, DroppableWidget, DnFC } from '@designer/react';
import { LoadTemplate } from '../../common/LoadTemplate';
import { useDropTemplate } from '../../hooks';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { matchComponent } from '../../shared';

const parseSteps = (parent: TreeNode) => {
  const steps: TreeNode[] = [];
  parent.children.forEach((node) => {
    if (matchComponent(node, 'Steps.Step')) {
      steps.push(node);
    }
  });
  return steps;
};

export const Steps: DnFC<StepsProps> & {
  Step?: React.FC<StepProps>;
} = observer((props) => {
  const nodeId = useNodeIdProps();
  const node = useTreeNode();
  const designer = useDropTemplate('Steps', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Steps.Step',
          'x-component-props': {
            title: '标题',
          },
        },
        children: source,
      }),
    ];
  });
  const steps = parseSteps(node);
  const renderSteps = () => {
    if (!node.children?.length) return <DroppableWidget />;

    return (
      <AntdSteps {...props}>
        {steps.map((step) => {
          const props = step.props['x-component-props'] || {};
          props[designer.props.nodeIdAttrName] = step.id;
          return (
            <Steps.Step
              {...props}
              key={step.id}
              title={
                <span data-content-editable="x-component-props.title" data-content-editable-node-id={step.id}>
                  {props.title}
                </span>
              }
            />
          );
        })}
      </AntdSteps>
    );
  };
  return (
    <div {...nodeId}>
      {renderSteps()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addStep'),
            icon: 'AddPanel',
            onClick: () => {
              const step = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'Steps.Step',
                  'x-component-props': {
                    title: '标题',
                  },
                },
              });
              node.append(step);
            },
          },
        ]}
      />
    </div>
  );
});

Steps.Step = (props) => {
  return <AntdSteps.Step {...props} />;
};

Steps.Behavior = createBehavior(
  {
    name: 'Steps',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Steps',
    designerProps: {
      propsSchema: createVoidFieldSchema(AllSchemas.Steps),
    },
    designerLocales: AllLocales.Steps,
  },
  {
    name: 'Steps.Step',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Steps.Step',
    designerProps: {
      propsSchema: createVoidFieldSchema(AllSchemas.Steps.Step),
    },
    designerLocales: AllLocales.Step,
  },
);

Steps.Resource = createResource({
  icon: 'TabSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Steps',
        'x-component-props': {
          direction: 'vertical',
        },
      },
    },
  ],
});
