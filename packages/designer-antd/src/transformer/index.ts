/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISchema, Schema } from '@formily/json-schema';
import { ITreeNode } from '@designer/core';
import { clone, uid, isValid } from '@designer/utils';

export interface ITransformerOptions {
  designableFieldName?: string;
  designableFormName?: string;
}

export interface IFormilySchema {
  schema?: ISchema;
  form?: Record<string, any>;
}

const createOptions = (options?: ITransformerOptions): ITransformerOptions => {
  return {
    designableFieldName: 'Field',
    designableFormName: 'Form',
    ...options,
  };
};

const findNode = (node: ITreeNode, finder?: (node: ITreeNode) => boolean) => {
  if (!node) return;
  if (finder?.(node)) return node;
  if (!node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    if (findNode(node.children[i])) return node.children[i];
  }
  return;
};

export const transformToSchema = (node: ITreeNode, options?: ITransformerOptions): IFormilySchema => {
  const realOptions = createOptions(options);
  const root = findNode(node, (child) => {
    return child.componentName === realOptions.designableFormName;
  });
  const schema = {
    type: 'object',
    properties: {},
  };
  if (!root) return { schema };

  const getKey = (node: ITreeNode, schema: ISchema) => {
    if (node.props?.name && !schema.properties?.[node.props?.name]) {
      return node.props?.name;
    }
    return node.id;
  };

  const createSchema = (node: ITreeNode, schema: ISchema = {}) => {
    if (node !== root) {
      Object.assign(schema, clone(node.props));
    }
    schema['x-designable-id'] = node.id;
    if (isValid(node.hidden)) {
      schema['x-designable-hidden'] = node.hidden;
    }
    if (schema.type === 'array') {
      if (node.children?.[0]) {
        if (node.children[0].componentName === realOptions.designableFieldName) {
          schema.items = createSchema(node.children[0]);
          schema['x-index'] = 0;
        }
      }
      node.children?.slice(1).forEach((child, index) => {
        if (child.componentName !== realOptions.designableFieldName) return;
        const key = getKey(child, schema);
        schema.properties = schema.properties || {};
        (schema.properties as any)[key] = createSchema(child);
        (schema.properties as any)[key]['x-index'] = index;
      });
    } else {
      node.children?.forEach((child, index) => {
        if (child.componentName !== realOptions.designableFieldName) return;
        const key = getKey(child, schema);
        schema.properties = schema.properties || {};
        (schema.properties as any)[key] = createSchema(child);
        (schema.properties as any)[key]['x-index'] = index;
      });
    }
    return schema;
  };
  return { form: clone(root.props), schema: createSchema(root, schema) };
};

export const transformToTreeNode = (formily: IFormilySchema = {}, options?: ITransformerOptions) => {
  const realOptions = createOptions(options);
  const root: ITreeNode = {
    componentName: realOptions.designableFormName,
    props: formily.form,
    children: [],
  };
  const schema = new Schema(formily.schema!);
  const cleanProps = (props: any) => {
    if (props['name'] === props['x-designable-id']) {
      delete props.name;
    }
    delete props['version'];
    delete props['_isJSONSchemaObject'];
    return props;
  };
  const appendTreeNode = (parent: ITreeNode, schema: Schema) => {
    if (!schema) return;
    const current = {
      id: schema['x-designable-id'] || uid(),
      componentName: realOptions.designableFieldName,
      props: cleanProps(schema.toJSON(false)),
      children: [],
      hidden: schema['x-designable-hidden'] ?? false,
    };
    if (current.props['x-component'] === 'Modal' || current.props['x-component'] === 'ConfirmModal') {
      current['containerClassName'] = '.ant-modal-content';
    }
    if (current.props['x-component'] === 'Drawer') {
      current['containerClassName'] = '.ant-drawer-content-wrapper';
    }

    parent.children?.push(current);
    if (schema.items && !Array.isArray(schema.items)) {
      appendTreeNode(current, schema.items);
    }
    schema.mapProperties((schema) => {
      schema['x-designable-id'] = schema['x-designable-id'] || uid();
      appendTreeNode(current, schema);
    });
  };
  schema.mapProperties((schema) => {
    schema['x-designable-id'] = schema['x-designable-id'] || uid();
    appendTreeNode(root, schema);
  });
  return root;
};
