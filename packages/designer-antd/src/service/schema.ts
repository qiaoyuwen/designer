import { Engine } from '@designer/core';
import { transformToSchema, transformToTreeNode } from '../transformer';

export const saveSchema = (designer: Engine, callbackFn?: (schemaJson: string) => Promise<void>) => {
  const value = JSON.stringify(transformToSchema(designer.getCurrentTree()));
  localStorage.setItem('formily-schema', value);
  callbackFn?.(value);
};

export const loadInitialSchema = (designer: Engine, initialSchema?: string) => {
  try {
    if (initialSchema) {
      localStorage.setItem('formily-schema', initialSchema);
    }
    designer.setCurrentTree(transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema') || '')));
  } catch {
    // skip
  }
};
