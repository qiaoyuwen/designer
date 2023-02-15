import React, { ReactElement } from 'react';

export const parseNode = (name: string, node?: ReactElement) => {
  const { schema } = node?.props;
  const children = React.Children.toArray(node.props.children);
  if (schema?.['x-component'] === name) {
    return node;
  }

  if (children) {
    for (const item of children) {
      if (item) {
        const result = parseNode(name, item as ReactElement);
        if (result) {
          return result;
        }
      }
    }
  }
  return null;
};

export const parseNodes = (name: string, root?: ReactElement) => {
  const result: any[] = [];

  const innerParse = (node?: ReactElement) => {
    if (!node?.props) {
      return;
    }
    const { schema } = node?.props;
    const children = React.Children.toArray(node.props.children);
    if (schema?.['x-component'] === name) {
      result.push(node);
    }

    if (children) {
      for (const item of children) {
        if (item) {
          innerParse(item as ReactElement);
        }
      }
    }
  };

  innerParse(root);
  return result;
};
