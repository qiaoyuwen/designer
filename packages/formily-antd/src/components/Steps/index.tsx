import { FC, Fragment, ReactElement } from 'react';
import { StepProps, Steps as AntdSteps } from 'antd';
import { FunctionComponent } from 'react';
import { parseNodes } from '../../utils';
import { RecursionField } from '@formily/react';
import classnames from 'classnames';
import './index.less';

type ComposedStep = FC<StepProps> & {
  Title?: FC<React.PropsWithChildren>;
  SubTitle?: FC<React.PropsWithChildren>;
  Description?: FC<React.PropsWithChildren>;
};

export const Steps: FunctionComponent<React.ComponentProps<typeof AntdSteps>> & {
  Step: ComposedStep;
} = (props) => {
  const items = parseNodes('Steps.Step', props.children as ReactElement);

  const renderItems = () => {
    return items.map((item) => {
      const getStepProps = () => {
        const stepProps = item.props.schema['x-component-props'];
        let title;
        let subTitle;
        let description;
        Object.keys(item.props.schema.properties).forEach((key) => {
          const property = item.props.schema.properties[key];
          // 没有子节点，跳过渲染
          if (!property['properties']) {
            return;
          }
          if (property['x-component'] === 'Steps.Step.Title') {
            title = <RecursionField schema={property} name={property.name} />;
          }
          if (property['x-component'] === 'Steps.Step.SubTitle') {
            subTitle = <RecursionField schema={property} name={property.name} />;
          }
          if (property['x-component'] === 'Steps.Step.Description') {
            description = <RecursionField schema={property} name={property.name} />;
          }
        });
        return {
          ...stepProps,
          title,
          subTitle,
          description,
        };
      };

      return <AntdSteps.Step {...getStepProps()} key={item.props.name} />;
    });
  };

  return (
    <AntdSteps {...props} className={classnames('formily-antd-steps', props.className)}>
      {items.length > 0 ? renderItems() : props.children}
    </AntdSteps>
  );
};

const Wrapper: FC<React.PropsWithChildren> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

Steps.Step = (props) => {
  return <AntdSteps.Step {...props} />;
};

Steps.Step.Title = Wrapper;
Steps.Step.SubTitle = Wrapper;
Steps.Step.Description = Wrapper;
