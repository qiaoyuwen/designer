import React, { ReactNode } from 'react';
import { observer } from '@formily/reactive-react';
import { usePrefix } from '@designer/react';
import './styles.less';

export interface IHeaderProps {
  extra?: ReactNode;
  title: ReactNode | string;
}

export const Header: React.FC<IHeaderProps> = observer(({ extra, title }) => {
  const prefix = usePrefix('tree-data-setter');
  return (
    <div className={`${prefix + '-layout-item-header'}`}>
      <div className={`${prefix + '-layout-item-title'}`}>{title}</div>
      {extra}
    </div>
  );
});
