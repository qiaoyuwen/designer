import { Fragment, FunctionComponent, useContext, useLayoutEffect, useRef, PropsWithChildren } from 'react';
import { each } from '@designer/utils';
import { DesignerLayoutContext } from '../context';
import { IDesignerLayoutProps } from '../types';
import cls from 'classnames';

export const Layout: FunctionComponent<PropsWithChildren<IDesignerLayoutProps>> = (props) => {
  const layout = useContext(DesignerLayoutContext);
  const ref = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    if (ref.current) {
      each(props.variables, (value, key) => {
        ref.current.style.setProperty(`--${key}`, value);
      });
    }
  }, []);

  if (layout) {
    return <Fragment>{props.children}</Fragment>;
  }

  return (
    <div
      ref={ref}
      className={cls({
        [`${props.prefixCls}app`]: true,
        [`${props.prefixCls}${props.theme}`]: props.theme,
      })}
    >
      <DesignerLayoutContext.Provider
        value={{
          theme: props.theme,
          prefixCls: props.prefixCls,
          position: props.position,
        }}
      >
        {props.children}
      </DesignerLayoutContext.Provider>
    </div>
  );
};

Layout.defaultProps = {
  theme: 'light',
  prefixCls: 'dn-',
  position: 'fixed',
};
