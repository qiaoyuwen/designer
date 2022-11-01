import { FC } from 'react';
import { RouterSetter } from '@designer/react-settings-form';

export interface IRouterWidgetProps {
  value: any[];
  onChange: (router: any[]) => void;
}

export const RouterWidget: FC<IRouterWidgetProps> = (props) => {
  return (
    <div>
      <RouterSetter value={props.value} onChange={props.onChange} />
    </div>
  );
};
