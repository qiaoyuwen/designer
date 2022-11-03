import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Card, Slider, Rate, Tag, Button, message, Divider } from 'antd';
import {
  BaseLayout,
  ProTable,
  Modal,
  ConfirmModal,
  HttpUtils,
  Button as FormilyButton,
  Text,
  Tabs,
} from '@designer/formily-antd';
import { createFormFieldSetComponentsFunc } from '@designer/designer-antd';
import { IRouteComponentProps, useModel } from 'umi';
import { ProjectPageServices } from '@/services/project-page';
import { history as UmiHistory } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
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
    Tabs,
    Divider,
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

const IndexPage: React.FC<IRouteComponentProps> = (props) => {
  const pageId = props.route.pageId as string;

  const form = useMemo(() => createForm(), [pageId]);
  const [schema, setSchema] = useState<any>();
  const { initialState, setInitialState } = useModel('@@initialState');
  const initialStateRef = useRef(initialState);

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

  useEffect(() => {
    initialStateRef.current = initialState;
  }, [initialState]);

  if (!schema) {
    return null;
  }

  const renderForm = () => {
    return (
      <Form {...schema.form} form={form}>
        <SchemaField
          schema={schema.schema}
          scope={{
            React,
            Antd: AntdScope,
            AntdIcon: AntdIconScope,
            HttpUtils,
            UmiHistory,
            initialStateRef,
            setInitialState,
            $setComponentsProps,
          }}
        />
      </Form>
    );
  };

  if (props.route.layout === false) {
    return renderForm();
  }

  return <PageContainer>{renderForm()}</PageContainer>;
};

export default IndexPage;
