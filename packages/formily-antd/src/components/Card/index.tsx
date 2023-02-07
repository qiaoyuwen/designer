import { Card as AntdCard, CardProps } from 'antd';
import React, { FC, Fragment, ReactElement } from 'react';
import { parseNode } from '../../utils';

type ComposedCard = FC<CardProps> & {
  Body: FC<React.PropsWithChildren>;
  Extra: FC<React.PropsWithChildren>;
  Title: FC<React.PropsWithChildren>;
};

export const Card: ComposedCard = (props) => {
  const body = parseNode('Card.Body', props.children as ReactElement);
  const extra = parseNode('Card.Extra', props.children as ReactElement) || props.extra;
  const title = parseNode('Card.Title', props.children as ReactElement) || props.title;

  const getProps = () => {
    const newProps = { ...props };
    delete newProps['value'];
    delete newProps['onChange'];
    return newProps;
  };

  return (
    <AntdCard {...getProps()} title={title} extra={extra}>
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
