import React, { useMemo } from 'react';
import { createBehavior, createResource, TreeNode } from '@designer/core';
import { createForm } from '@formily/core';
import { observer } from '@formily/react';
import { Form as FormilyForm } from '@formily/antd';
import { usePrefix, DnFC } from '@designer/react';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import './styles.less';

export const Form: DnFC<
  React.ComponentProps<typeof FormilyForm> & {
    requestConifg?: {
      dataSource?: string;
      url?: string;
    };
  }
> = observer((props) => {
  const { requestConifg } = props;
  const prefix = usePrefix('designable-form');
  const form = useMemo(() => {
    let values = {};
    try {
      if (requestConifg?.dataSource) {
        values = JSON.parse(requestConifg?.dataSource);
      }
    } catch {}

    return createForm({
      designable: true,
      values,
    });
  }, [requestConifg]);

  return (
    <FormilyForm {...props} style={{ ...props.style }} className={prefix} form={form}>
      {props.children}
    </FormilyForm>
  );
});

Form.Behavior = createBehavior({
  name: 'Form',
  selector: (node) => node.componentName === 'Form',
  designerProps(node: TreeNode) {
    return {
      draggable: !node.isRoot,
      cloneable: !node.isRoot,
      deletable: !node.isRoot,
      droppable: true,
      propsSchema: {
        type: 'object',
        properties: {
          'form-layout-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            properties: AllSchemas.FormLayout.properties,
          },
          'form-style-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            'x-component-props': { defaultExpand: false },
            properties: AllSchemas.CSSStyle.properties,
          },
        },
      },
      defaultProps: {
        labelCol: 6,
        wrapperCol: 12,
      },
    };
  },
  designerLocales: AllLocales.Form,
});

Form.Resource = createResource({
  title: { 'zh-CN': '表单', 'en-US': 'Form' },
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-component': 'Form',
      },
    },
  ],
});
