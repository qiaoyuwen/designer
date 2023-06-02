import { ISchema } from '@formily/react';

export const TableGroup: ISchema & {
  Table?: ISchema & {
    Column?: ISchema;
  };
  Pagination?: ISchema;
} = {
  type: 'object',
  properties: {},
};

const Table: ISchema & { Column?: ISchema } = {
  type: 'object',
  properties: {
    bordered: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    showHeader: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    sticky: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'middle'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'small',
      },
    },
  },
};

const Column: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    align: {
      type: 'string',
      enum: ['left', 'right', 'center'],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: 'left',
        optionType: 'button',
      },
    },
    colSpan: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    width: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    fixed: {
      type: 'string',
      enum: ['left', 'right', false],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        optionType: 'button',
      },
    },
    hideInSearch: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
    },
    type: {
      type: 'string',
      enum: ['Text', 'Select', 'DateRange'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'Text',
      },
    },
    options: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceSetter',
      'x-reactions': {
        dependencies: ['.type'],
        fulfill: {
          state: {
            display: `{{$deps[0] === 'Select' ? 'visible' : 'hidden'}}`,
          },
        },
      },
    },
  },
};

const Pagination: ISchema & {
  Table?: ISchema & {
    Column?: ISchema;
  };
  Pagination?: ISchema;
} = {
  type: 'object',
  properties: {
    showSizeChanger: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    showQuickJumper: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    pageSize: {
      type: 'number',
      enum: [10, 20, 50, 100],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 10,
      },
    },
  },
};

Table.Column = Column;
TableGroup.Table = Table;
TableGroup.Pagination = Pagination;