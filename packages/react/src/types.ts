import { Engine } from '@designer/core';

export interface IDesignerLayoutProps {
  prefixCls?: string;
  theme?: 'dark' | 'light' | (string & {});
  variables?: Record<string, string>;
  position?: 'fixed' | 'absolute' | 'relative';
}
export interface IDesignerProps extends IDesignerLayoutProps {
  engine: Engine;
}

export interface IDesignerLayoutContext {
  theme?: 'dark' | 'light' | (string & {});
  prefixCls: string;
  position: 'fixed' | 'absolute' | 'relative';
}
