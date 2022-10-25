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
import { BaseLayout, ProTable, Modal, ConfirmModal, HttpUtils } from '@designer/formily-antd';
import { createFormFieldSetComponentsFunc } from '@designer/designer-antd';
import { request } from 'umi';

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
  },
});

const AntdScope = {
  Button,
  Tag,
  message,
};

const pageId = '1789bd4124f24e4e43d4a3b0cbb3685f';
const token =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjNjgwNjhkYjQ2ZDIxMWVkYjkxNDAwZmYxOTkxMDdmMSIsImV4cCI6MTY5NzA5NDkzNH0.e5BjDXPr4ZVBQbf7gFeD4Uh8XpjXnRZBOckFIGczrfI';

export const DemoPage: React.FC = () => {
  const form = useMemo(() => createForm(), []);
  const [schema, setSchema] = useState<any>();

  const $setComponentsProps = useMemo(() => {
    return createFormFieldSetComponentsFunc(form);
  }, []);

  const getSchema = () => {
    request<any>(`/api/project_page/${pageId}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }).then((res) => {
      if (res.data?.schemaJson) {
        try {
          setSchema(JSON.parse(res.data.schemaJson));
        } catch {}
      }
    });
  };

  useEffect(() => {
    getSchema();
  }, []);

  if (!schema) {
    return null;
  }

  return (
    <Form {...schema.form} form={form}>
      <SchemaField schema={schema.schema} scope={{ React, Antd: AntdScope, HttpUtils, $setComponentsProps }} />
    </Form>
  );
};

export default DemoPage;
