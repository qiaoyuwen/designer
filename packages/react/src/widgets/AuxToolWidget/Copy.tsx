import React from 'react';
import { TreeNode } from '@designer/core';
import { usePrefix } from '../../hooks';
import { IconWidget } from '../IconWidget';
import { Button } from 'antd';
export interface ICopyProps {
  node: TreeNode;
  style?: React.CSSProperties;
}

export const Copy: React.FC<ICopyProps> = ({ node, style }) => {
  const prefix = usePrefix('aux-copy');
  if (node === node.root) return null;
  return (
    <Button
      className={prefix}
      style={style}
      type="primary"
      onClick={() => {
        const originName = node.props['name'];
        node.props['name'] = undefined;
        TreeNode.clone([node]);
        node.props['name'] = originName;
      }}
    >
      <IconWidget infer="Clone" />
    </Button>
  );
};

Copy.displayName = 'Copy';
