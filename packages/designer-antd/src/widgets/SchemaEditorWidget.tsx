import React from 'react';
import { TreeNode, ITreeNode } from '@designer/core';
import { MonacoInput } from '@designer/react-settings-form';
import { transformToSchema, transformToTreeNode } from '../transformer';

export interface ISchemaEditorWidgetProps {
  tree: TreeNode;
  onChange?: (tree: ITreeNode) => void;
}

export const SchemaEditorWidget: React.FC<ISchemaEditorWidgetProps> = (props) => {
  return (
    <MonacoInput
      {...props}
      value={JSON.stringify(transformToSchema(props.tree), null, 2)}
      onChange={(value) => {
        props.onChange?.(transformToTreeNode(JSON.parse(value)));
      }}
      language="json"
    />
  );
};
