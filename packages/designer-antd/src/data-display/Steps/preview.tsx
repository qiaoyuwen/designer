import React from 'react';
import { observer } from '@formily/react';
import { Steps as FormilyAntdSteps } from '@designer/formily-antd';
import { TreeNode, createBehavior, createResource } from '@designer/core';
import { useNodeIdProps, useTreeNode, DroppableWidget, DnFC, TreeNodeWidget } from '@designer/react';
import { LoadTemplate } from '../../common/LoadTemplate';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { parseNode, parseNodes } from '../../utils';
import { useDropTemplate } from '../../hooks';

export const Steps: DnFC<React.ComponentProps<typeof FormilyAntdSteps>> = observer((props) => {
  const nodeId = useNodeIdProps();
  const node = useTreeNode();
  const designer = useDropTemplate('Steps', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Steps.Step',
        },
        children: source,
      }),
    ];
  });

  const steps = parseNodes(node, 'Steps.Step');
  const renderSteps = () => {
    if (!node.children?.length) return <DroppableWidget />;
    return (
      <FormilyAntdSteps {...props}>
        {steps.map((step) => {
          let title = parseNode(step, 'Steps.Step.Title');
          let subTitle = parseNode(step, 'Steps.Step.SubTitle');
          let description = parseNode(step, 'Steps.Step.Description');

          if (!title) {
            title = new TreeNode({
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'Steps.Step.Title',
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
            title.append(defaultText);
            step.append(title);
          }

          if (!subTitle) {
            subTitle = new TreeNode({
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'Steps.Step.SubTitle',
              },
            });
            step.append(subTitle);
          }

          if (!description) {
            description = new TreeNode({
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'Steps.Step.Description',
              },
            });
            step.append(description);
          }

          const props = step.props['x-component-props'] || {};
          props[designer.props.nodeIdAttrName] = step.id;
          return (
            <FormilyAntdSteps.Step
              {...props}
              key={step.id}
              title={
                <FormilyAntdSteps.Step.Title>
                  {title?.children?.length ? (
                    <TreeNodeWidget node={title} />
                  ) : (
                    <DroppableWidget style={{ minWidth: 80 }} node={title} />
                  )}
                </FormilyAntdSteps.Step.Title>
              }
              subTitle={
                <FormilyAntdSteps.Step.SubTitle>
                  {subTitle?.children?.length ? (
                    <TreeNodeWidget node={subTitle} />
                  ) : (
                    <DroppableWidget style={{ minWidth: 120 }} node={subTitle} />
                  )}
                </FormilyAntdSteps.Step.SubTitle>
              }
              description={
                <FormilyAntdSteps.Step.Description>
                  {description?.children?.length ? (
                    <TreeNodeWidget node={description} />
                  ) : (
                    <DroppableWidget node={description} />
                  )}
                </FormilyAntdSteps.Step.Description>
              }
            />
          );
        })}
      </FormilyAntdSteps>
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

Steps.Behavior = createBehavior(
  {
    name: 'Steps',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Steps',
    designerProps: {
      droppable: true,
      allowAppend: (_, sources) => {
        return sources.every((node) => node.props['x-component'] === 'Steps.Step');
      },
      propsSchema: createVoidFieldSchema(AllSchemas.Steps),
    },
    designerLocales: AllLocales.Steps,
  },
  {
    name: 'Steps.Step',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Steps.Step',
    designerProps: {
      allowDrop: (target) => {
        return target.props['x-component'] === 'Steps';
      },
      propsSchema: createVoidFieldSchema(AllSchemas.Steps.Step),
    },
    designerLocales: AllLocales.Step,
  },
  {
    name: 'Steps.Step.Title',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Steps.Step.Title',
    designerProps: {
      droppable: true,
      draggable: false,
      deletable: false,
      cloneable: false,
      hideable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.Steps.Step.Title),
    },
    designerLocales: AllLocales.StepTitle,
  },
  {
    name: 'Steps.Step.SubTitle',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Steps.Step.SubTitle',
    designerProps: {
      droppable: true,
      draggable: false,
      deletable: false,
      cloneable: false,
      hideable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.Steps.Step.SubTitle),
    },
    designerLocales: AllLocales.StepSubTitle,
  },
  {
    name: 'Steps.Step.Description',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Steps.Step.Description',
    designerProps: {
      droppable: true,
      draggable: false,
      deletable: false,
      cloneable: false,
      hideable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.Steps.Step.Description),
    },
    designerLocales: AllLocales.StepDescription,
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
