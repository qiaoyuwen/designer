import { Engine } from '@designer/core';
import { transformToSchema, transformToTreeNode } from '../transformer';
import { message } from 'antd';

export const saveSchema = (designer: Engine) => {
  localStorage.setItem('formily-schema', JSON.stringify(transformToSchema(designer.getCurrentTree())));
  message.success('Save Success');
};

export const loadInitialSchema = (designer: Engine) => {
  try {
    designer.setCurrentTree(transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema') || '')));
  } catch {
    // skip
  }
};
