import React from 'react';
import { DatePicker as FormilyDatePicker } from '@formily/antd-v5';
import { createBehavior, createResource } from '@designer/core';
import { DnFC } from '@designer/react';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const DatePicker: DnFC<React.ComponentProps<typeof FormilyDatePicker>> = FormilyDatePicker;

DatePicker.Behavior = createBehavior(
  {
    name: 'DatePicker',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'DatePicker',
    designerProps: {
      propsSchema: createFieldSchema({
        component: AllSchemas.DatePicker,
        valueInputTypes: ['expression'],
      }),
    },
    designerLocales: AllLocales.DatePicker,
  },
  {
    name: 'DatePicker.RangePicker',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'DatePicker.RangePicker',
    designerProps: {
      propsSchema: createFieldSchema({
        component: AllSchemas.DatePicker.RangePicker,
        valueInputTypes: ['expression'],
      }),
    },
    designerLocales: AllLocales.DateRangePicker,
  },
);

DatePicker.Resource = createResource(
  {
    icon: 'DatePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string',
          title: 'DatePicker',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
        },
      },
    ],
  },
  {
    icon: 'DateRangePickerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'string[]',
          title: 'DateRangePicker',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker.RangePicker',
        },
      },
    ],
  },
);
