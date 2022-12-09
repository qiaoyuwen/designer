import React from 'react';
import { TreeNode } from '@designer/core';
import { usePrefix } from '../../hooks';
import { IconWidget } from '../IconWidget';
import { Button } from 'antd';
export interface ICopyProps {
  node: TreeNode;
  style?: React.CSSProperties;
}

export const Hide: React.FC<ICopyProps> = ({ node, style }) => {
  const prefix = usePrefix('aux-hide');
  if (node === node.root) return null;
  return (
    <Button
      className={prefix}
      style={style}
      type="primary"
      onClick={() => {
        node.hidden = true;
      }}
    >
      <IconWidget infer="EyeClose" />
    </Button>
  );
};

Hide.displayName = 'Hide';
