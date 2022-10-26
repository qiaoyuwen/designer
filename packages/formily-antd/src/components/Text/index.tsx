import React, { FunctionComponent } from 'react';

export interface ITextProps {
  title?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
  style?: React.CSSProperties;
  className?: string;
}

export const Text: FunctionComponent<ITextProps> = ({ title, mode, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, title);
};
