import React, { FunctionComponent } from 'react';

export interface ITextProps {
  value?: string;
  text?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
  style?: React.CSSProperties;
  className?: string;
}

export const Text: FunctionComponent<ITextProps> = ({ value, text, mode, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, value ?? text);
};
