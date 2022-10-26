import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { BaseLayout, ProTable, Modal, ConfirmModal, HttpUtils, Button as FormilyButton } from '@designer/formily-antd';
import { createFormFieldSetComponentsFunc } from '@designer/designer-antd';
import { IRouteComponentProps } from 'umi';
import { ProjectPageServices } from '@/services/project-page';

const Text: React.FC<{
  value?: string;
  content?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, value || content);
};

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
    Text,
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
  },
});

const AntdScope = {
  Button,
  Tag,
  message,
};

const IndexPage: React.FC<IRouteComponentProps> = (props) => {
  const pageId = props.route.pageId as string;
  const form = useMemo(() => createForm(), [pageId]);
  const [schema, setSchema] = useState<any>();

  const $setComponentsProps = useMemo(() => {
    return createFormFieldSetComponentsFunc(form);
  }, []);

  const getSchema = useCallback(async () => {
    const projectPage = await ProjectPageServices.getProjectPageDetail({
      id: pageId,
    });
    try {
      setSchema(JSON.parse(projectPage.schemaJson));
    } catch {}
  }, [pageId]);

  useEffect(() => {
    getSchema();
  }, [getSchema]);

  if (!schema) {
    return null;
  }

  return (
    <Form {...schema.form} form={form}>
      <SchemaField schema={schema.schema} scope={{ React, Antd: AntdScope, HttpUtils, $setComponentsProps }} />
    </Form>
  );
};

export default IndexPage;
