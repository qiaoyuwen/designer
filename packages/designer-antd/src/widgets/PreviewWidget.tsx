import React, { useMemo } from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Cascader,
  Editable,
  Input,
  NumberPicker,
  Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayCards,
} from '@formily/antd';
import { Card, Slider, Rate, Tag, Button, message } from 'antd';
import {
  BaseLayout,
  ProTable,
  Modal,
  ConfirmModal,
  HttpUtils,
  Button as FormilyButton,
  Text,
} from '@designer/formily-antd';
import { TreeNode } from '@designer/core';
import { transformToSchema } from '../transformer';
import { createFormFieldSetComponentsFunc } from '../utils';

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
    // 自定义组件
    BaseLayout,
    Table: ProTable,
    Modal,
    ConfirmModal,
    Button: FormilyButton,
    Text,
  },
});

const AntdScope = {
  Button,
  Tag,
  message,
};

export interface IPreviewWidgetProps {
  tree: TreeNode;
}

export const PreviewWidget: React.FC<IPreviewWidgetProps> = (props) => {
  const form = useMemo(() => createForm(), []);
  const { form: formProps, schema } = transformToSchema(props.tree);

  const $setComponentsProps = useMemo(() => {
    return createFormFieldSetComponentsFunc(form);
  }, []);

  return (
    <Form {...formProps} form={form}>
      <SchemaField schema={schema} scope={{ React, Antd: AntdScope, HttpUtils, $setComponentsProps }} />
    </Form>
  );
};
