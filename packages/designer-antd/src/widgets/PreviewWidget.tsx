import React, { useEffect, useMemo } from 'react';
import { createForm } from '@formily/core';
import { createSchemaField, FormConsumer } from '@formily/react';
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
import { Slider, Rate, Tag, Button, message, Divider, Statistic, Image, Tooltip, Popover } from 'antd';
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
  Descriptions,
  Collapse,
  Card,
} from '@designer/formily-antd';
import { createFormFieldSetComponentsFunc } from '../utils';
import { UserOutlined, LockOutlined, MobileOutlined, SafetyOutlined, SearchOutlined } from '@ant-design/icons';

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
    Slider,
    Rate,
    Steps,
    Image,
    // 自定义组件
    Card,
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
    Descriptions,
    Collapse,
    Popover,
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
  SearchOutlined,
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
    let result: any = {
      form: {},
      schema: {},
    };
    try {
      result = JSON.parse(schemaJson);
    } catch {}
    return result;
  }, [schemaJson]);

  useEffect(() => {
    if (schema.form.requestConifg?.dataSource) {
      let values = {};
      try {
        values = JSON.parse(schema.form.requestConifg?.dataSource);
      } catch {}
      form.setValues(values);
    }
  }, [form, schema]);

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
      <FormConsumer>
        {() => (
          <div
            style={{
              marginTop: 24,
              padding: 5,
              border: '1px dashed #666',
            }}
          >
            实时响应：{JSON.stringify(form.values || '')}
          </div>
        )}
      </FormConsumer>
    </Form>
  );
};
