import { Form, FormPathPattern } from '@formily/core';
import { TreeNode } from '@designer/core';
import { matchComponent } from './shared';

export const createFormFieldSetComponentsFunc = ($form: Form) => {
  return (pattern: FormPathPattern, props: Record<string | number | symbol, any>) => {
    const field = $form.query(pattern).take();
    field?.setComponentProps(props);
  };
};

export const parseNode = (parent: TreeNode, name: string) => {
  let result: TreeNode;
  parent.children.forEach((node) => {
    if (matchComponent(node, name)) {
      result = node;
    }
  });
  return result;
};

export const parseNodes = (parent: TreeNode, name: string) => {
  const result: TreeNode[] = [];
  parent.children.forEach((node) => {
    if (matchComponent(node, name)) {
      result.push(node);
    }
  });
  return result;
};
