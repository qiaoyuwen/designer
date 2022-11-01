import { FC } from 'react';
import { RouterSetter } from '@designer/react-settings-form';

export const RouterWidget: FC = () => {
  const onChange = (data: any) => {
    console.log('data', data);
  };

  return (
    <div>
      <RouterSetter onChange={onChange} />
    </div>
  );
};
