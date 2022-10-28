import { Statistic as AntdStatistic } from 'antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const Statistic: DnFC<React.ComponentProps<typeof AntdStatistic>> = (props) => {
  return (
    <div {...(props as any)}>
      <AntdStatistic {...props} />
    </div>
  );
};

Statistic.Behavior = createBehavior({
  name: 'Statistic',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Statistic',
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Statistic),
  },
  designerLocales: AllLocales.Statistic,
});

Statistic.Resource = createResource({
  icon: 'GridSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Statistic',
        'x-component-props': {
          title: '标题',
          value: '数值',
        },
      },
    },
  ],
});
