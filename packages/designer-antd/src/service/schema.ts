import { Engine } from '@designer/core';
import { transformToSchema, transformToTreeNode } from '../transformer';

export const saveSchema = (designer: Engine, callbackFn?: (schemaJson: string) => Promise<void>) => {
  const value = JSON.stringify(transformToSchema(designer.getCurrentTree()));
  // localStorage.setItem('formily-schema', value);
  callbackFn?.(value);
};

export const loadInitialSchema = (designer: Engine, initialSchema?: string) => {
  try {
    designer.setCurrentTree(transformToTreeNode(initialSchema ? JSON.parse(initialSchema) : undefined));
  } catch {
    // skip
  }
};
