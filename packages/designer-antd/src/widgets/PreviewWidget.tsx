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
  FormCollapse,
  ArrayTable,
  ArrayCards,
} from '@formily/antd';
import { Card, Slider, Rate, Tag, Button, message, Divider, Statistic, Image, Tooltip } from 'antd';
import {
  BaseLayout,
  ProTable,
  Modal,
  ConfirmModal,
  HttpUtils,
  Button as FormilyButton,
  Text,
  Tabs,
  Steps,
  Drawer,
} from '@designer/formily-antd';
import { createFormFieldSetComponentsFunc } from '../utils';
import { UserOutlined, LockOutlined, MobileOutlined, SafetyOutlined } from '@ant-design/icons';

const SchemaField = createSchemaField({
  components: {
    Space,
    Grid: FormGrid,
    FormLayout,
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
    Steps,
    Image,
    // 自定义组件
    BaseLayout,
    Table: ProTable,
    Modal,
    ConfirmModal,
    Button: FormilyButton,
    Text,
    Tabs,
    Divider,
    Statistic,
    Drawer,
    Tooltip,
  },
});

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

export interface IPreviewWidgetProps {
  schemaJson: string;
  UmiHistory?: any;
}

export const PreviewWidget: React.FC<IPreviewWidgetProps> = (props) => {
  const { schemaJson, UmiHistory } = props;
  const form = useMemo(() => createForm(), []);

  const $setComponentsProps = useMemo(() => {
    return createFormFieldSetComponentsFunc(form);
  }, []);

  const schema = useMemo(() => {
    let result = {
      form: {},
      schema: {},
    };
    try {
      result = JSON.parse(schemaJson);
    } catch {}
    return result;
  }, [schemaJson]);

  return (
    <Form {...schema.form} form={form}>
      <SchemaField
        schema={schema.schema}
        scope={{
          $React: React,
          $Antd: AntdScope,
          $AntdIcon: AntdIconScope,
          $HttpUtils: HttpUtils,
          $UmiHistory: UmiHistory,
          $setComponentsProps,
        }}
      />
    </Form>
  );
};
