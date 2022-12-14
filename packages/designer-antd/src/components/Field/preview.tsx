/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FormPath } from '@formily/core';
import { toJS } from '@formily/reactive';
import {
  ArrayField,
  Field as InternalField,
  ObjectField,
  VoidField,
  observer,
  ISchema,
  Schema,
  useForm,
} from '@formily/react';
import { FormItem } from '@formily/antd';
import { createBehavior } from '@designer/core';
import { useDesigner, useTreeNode, useComponents, DnFC } from '@designer/react';
import { isArr, isStr, reduce, each, compiler } from '@designer/utils';
import { Container } from '../../common/Container';
import { AllLocales } from '../../locales';
import { Tag, Button, message } from 'antd';
import { createFormFieldSetComponentsFunc } from '../../utils';
import { HttpUtils } from '@designer/formily-antd';
import { UserOutlined, LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons';

Schema.silent(true);
compiler.silent(true);

const AntdScope = {
  Button,
  Tag,
  message,
};

const AntdIconScope = {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyOutlined,
};

const SchemaStateMap = {
  title: 'title',
  description: 'description',
  default: 'value',
  enum: 'dataSource',
  readOnly: 'readOnly',
  writeOnly: 'editable',
  required: 'required',
  remarks: 'remarks',
  'x-content': 'content',
  'x-value': 'value',
  'x-editable': 'editable',
  'x-disabled': 'disabled',
  'x-read-pretty': 'readPretty',
  'x-read-only': 'readOnly',
  'x-visible': 'visible',
  'x-hidden': 'hidden',
  'x-display': 'display',
  'x-pattern': 'pattern',
};

const NeedShownExpression = {
  title: true,
  description: true,
  default: true,
  'x-content': true,
  'x-value': true,
};

const isExpression = (val: any) => isStr(val) && /^\{\{.*\}\}$/.test(val);

const filterExpression = (val: any) => {
  if (typeof val === 'object') {
    const isArray = isArr(val);
    const results = reduce(
      val,
      (buf: any, value, key) => {
        if (isExpression(value)) {
          return buf;
        } else {
          const results: any = filterExpression(value);
          if (results === undefined || results === null) return buf;
          if (isArray) {
            return buf.concat([results]);
          }
          buf[key] = results;
          return buf;
        }
      },
      isArray ? [] : {},
    );
    return results;
  }
  if (isExpression(val)) {
    return;
  }
  return val;
};

const toDesignableFieldProps = (schema: ISchema, components: any, nodeIdAttrName: string, id: string, $form: any) => {
  const results: any = {};
  each(SchemaStateMap, (fieldKey, schemaKey) => {
    const value = schema[schemaKey as keyof ISchema];
    if (isExpression(value)) {
      if (!NeedShownExpression[schemaKey as keyof typeof NeedShownExpression]) return;
      if (value) {
        results[fieldKey] = value;
        return;
      }
    } else if (value) {
      results[fieldKey] = filterExpression(value);
    }
  });
  if (!components['FormItem']) {
    components['FormItem'] = FormItem;
  }
  const decorator = schema['x-decorator'] && FormPath.getIn(components, schema['x-decorator']);
  const component = schema['x-component'] && FormPath.getIn(components, schema['x-component']);
  const decoratorProps = schema['x-decorator-props'] || {};
  const componentProps = schema['x-component-props'] || {};

  if (decorator) {
    results.decorator = [decorator, toJS(decoratorProps)];
  }
  if (component) {
    const $setComponentsProps = createFormFieldSetComponentsFunc($form);
    results.component = [
      component,
      compiler.compile(toJS(componentProps), {
        $React: React,
        $Antd: AntdScope,
        $AntdIcon: AntdIconScope,
        $HttpUtils: HttpUtils,
        $form,
        $setComponentsProps,
      }),
    ];
  }
  if (decorator) {
    FormPath.setIn(results['decorator'][1], nodeIdAttrName, id);
  } else if (component) {
    FormPath.setIn(results['component'][1], nodeIdAttrName, id);
  }

  results.title = results.title && <span data-content-editable="title">{results.title}</span>;
  results.description = results.description && <span data-content-editable="description">{results.description}</span>;
  return results;
};

export const Field: DnFC<ISchema> = observer((props) => {
  const designer = useDesigner();
  const components = useComponents();
  const node = useTreeNode();
  const $form = useForm();

  if (!node) return null;
  const fieldProps = toDesignableFieldProps(props, components, designer.props.nodeIdAttrName || '', node.id, $form);
  if (props.type === 'object') {
    const renderObjectField = () => {
      return (
        <ObjectField {...fieldProps} name={node.id}>
          {props.children}
        </ObjectField>
      );
    };
    if (node.props['x-component'] === 'Modal' || node.props['x-component'] === 'Drawer') {
      return renderObjectField();
    }
    return <Container>{renderObjectField()}</Container>;
  } else if (props.type === 'array') {
    return <ArrayField {...fieldProps} name={node.id} />;
  } else if (node.props.type === 'void') {
    return (
      <VoidField {...fieldProps} name={node.id}>
        {props.children}
      </VoidField>
    );
  }
  return <InternalField {...fieldProps} name={node.id} />;
});

Field.Behavior = createBehavior({
  name: 'Field',
  selector: 'Field',
  designerLocales: AllLocales.Field,
});
