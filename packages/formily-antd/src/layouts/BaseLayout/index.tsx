import cls from 'classnames';

const prefixCls = 'base-layout';

export interface IBaseLayoutProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BaseLayout: React.FC<React.PropsWithChildren<IBaseLayoutProps>> = ({ className, style, children }) => {
  return (
    <div className={cls(prefixCls, className)} style={style}>
      {children}
    </div>
  );
};

export default BaseLayout;
