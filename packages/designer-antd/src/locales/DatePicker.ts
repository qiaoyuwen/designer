import { createLocales } from '@designer/core';

export const DatePicker = {
  'zh-CN': {
    title: '日期选择',
    settings: {
      'x-component-props': {
        disabledDate: {
          title: '不可选日期',
          tooltip: '格式 (currentDate: moment) => boolean',
        },
        disabledTime: {
          title: '不可选时间',
          tooltip: '格式 (currentDate: moment) => boolean',
        },
        inputReadOnly: '输入框只读',
        format: '格式',
        picker: {
          title: '选择器类型',
          dataSource: ['时间', '日期', '月份', '年', '季度', '财年'],
        },
        showNow: '显示此刻',
        showTime: '时间选择',
        showToday: '显示今天',
      },
    },
  },
};

export const DateRangePicker = createLocales(DatePicker, {
  'zh-CN': {
    title: '日期范围',
  },
});
