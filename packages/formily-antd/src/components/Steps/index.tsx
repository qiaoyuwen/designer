import { Steps as AntdSteps } from 'antd';
import { FunctionComponent } from 'react';

export const Steps: FunctionComponent<React.ComponentProps<typeof AntdSteps>> & {
  Step: typeof AntdSteps.Step;
} = ({ children, ...props }) => {
  const items = (children as any).props?.children[0]?.props?.children?.map((item, index) => {
    const stepProps = {
      ...item.props.schema['x-component-props'],
    };
    return <AntdSteps.Step key={index} {...stepProps} />;
  });

  return <AntdSteps {...props}>{items}</AntdSteps>;
};

Steps.Step = AntdSteps.Step;
