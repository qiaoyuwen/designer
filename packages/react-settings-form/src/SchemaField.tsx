import { createSchemaField } from '@formily/react';
import {
  FormItem,
  Input,
  NumberPicker,
  DatePicker,
  TimePicker,
  Select,
  Radio,
  Switch,
  Space,
  ArrayItems,
  ArrayTable,
  FormCollapse,
  FormGrid,
  FormLayout,
  FormTab,
} from '@formily/antd';
import { Slider } from 'antd';
import {
  CollapseItem,
  SizeInput,
  ValueInput,
  MonacoInput,
  DrawerSetter,
  FoldItem,
  ValidatorSetter,
  DataSourceSetter,
} from './components';

export const SchemaField: any = createSchemaField({
  components: {
    FormItem,
    Input,
    NumberPicker,
    DatePicker,
    TimePicker,
    Select,
    Radio,
    Switch,
    Space,
    ArrayItems,
    ArrayTable,
    FormCollapse,
    FormGrid,
    FormLayout,
    FormTab,
    Slider,
    // 自定义组件
    CollapseItem,
    SizeInput,
    ValueInput,
    MonacoInput,
    DrawerSetter,
    FoldItem,
    ValidatorSetter,
    DataSourceSetter,
  },
});
