import { Engine, GlobalRegistry } from '@designer/core';
import { FunctionComponent, useEffect, useRef, PropsWithChildren } from 'react';
import { DesignerEngineContext } from '../context';
import { useDesigner } from '../hooks';
import { IDesignerProps } from '../types';
import { GhostWidget } from '../widgets';
import { Layout } from './Layout';
import * as icons from '../icons';

GlobalRegistry.registerDesignerIcons(icons);

export const Designer: FunctionComponent<PropsWithChildren<IDesignerProps>> = (props) => {
  const engine = useDesigner();
  const ref = useRef<Engine>();

  useEffect(() => {
    if (props.engine) {
      if (props.engine && ref.current && props.engine !== ref.current) {
        ref.current.unmount();
      }
      props.engine.mount();
      ref.current = props.engine;
    }

    return () => {
      props.engine?.unmount();
    };
  }, [props.engine]);

  if (engine) {
    throw new Error('There can only be one Designable Engine Context in the React Tree');
  }

  return (
    <Layout {...props}>
      <DesignerEngineContext.Provider value={props.engine}>
        {props.children}
        <GhostWidget />
      </DesignerEngineContext.Provider>
    </Layout>
  );
};

Designer.defaultProps = {
  prefixCls: 'dn-',
  theme: 'light',
};
