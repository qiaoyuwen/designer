import React, { ReactNode } from 'react';
import styles from './index.less';

export interface IHeaderProps {
  extra?: ReactNode;
  title: ReactNode | string;
}

export const Header: React.FC<IHeaderProps> = ({ extra, title }) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      {extra}
    </div>
  );
};
