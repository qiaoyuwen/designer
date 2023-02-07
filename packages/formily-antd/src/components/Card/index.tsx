import { Card as AntdCard, CardProps } from 'antd';
import React, { FC, Fragment, ReactElement } from 'react';

type ComposedCard = FC<CardProps> & {
  Body: FC<React.PropsWithChildren>;
  Extra: FC<React.PropsWithChildren>;
  Title: FC<React.PropsWithChildren>;
};

const findNode = (name: string, node?: ReactElement) => {
  const { schema } = node?.props;
  const children = React.Children.toArray(node.props.children);
  if (schema?.['x-component'] === name) {
    return node;
  }

  if (children) {
    for (const item of children) {
      if (item) {
        const result = findNode(name, item as ReactElement);
        if (result) {
          return result;
        }
      }
    }
  }
  return null;
};

export const Card: ComposedCard = (props) => {
  const body = findNode('Card.Body', props.children as ReactElement);
  const extra = findNode('Card.Extra', props.children as ReactElement) || props.extra;
  const title = findNode('Card.Title', props.children as ReactElement) || props.title;

  return (
    <AntdCard {...props} title={title} extra={extra}>
      {body ? body : props.children}
    </AntdCard>
  );
};

const Wrapper: FC<React.PropsWithChildren> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

Card.Body = Wrapper;
Card.Extra = Wrapper;
Card.Title = Wrapper;
