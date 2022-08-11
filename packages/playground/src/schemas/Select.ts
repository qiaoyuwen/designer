import { ISchema } from '@formily/react';

export const Select: ISchema = {
  type: 'object',
  properties: {
    mode: {
      type: 'string',
      enum: ['', 'multiple', 'tags'],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: '',
        optionType: 'button',
      },
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    allowClear: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    autoClearSearchValue: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    dropdownMatchSelectWidth: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    autoFocus: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    bordered: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    defaultActiveFirstOption: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    defaultOpen: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    labelInValue: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showArrow: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    showSearch: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    virtual: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultValue: true,
      },
    },
    filterOption: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'ValueInput',
      'x-component-props': {
        include: ['boolean', 'expression'],
      },
    },
    filterSort: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'ValueInput',
      'x-component-props': {
        include: ['expression'],
      },
    },
    listHeight: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 256,
      },
    },
    maxTagCount: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    maxTagPlaceholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    maxTagTextLength: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'middle', ''],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'middle',
      },
    },
  },
};
