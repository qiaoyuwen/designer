export const TableGroup = {
  'zh-CN': {
    title: '表格组',
    settings: {
      'x-component-props': {},
    },
  },
};

export const TableGroupTable = {
  'zh-CN': {
    title: '表格',
    addColumn: '添加列',
    settings: {
      'x-component-props': {
        showHeader: '显示头部',
        sticky: '吸顶',
        align: {
          title: '对齐',
          dataSource: ['左', '右', '居中'],
        },
        colSpan: '跨列',
        fixed: { title: '固定列', dataSource: ['左', '右', '无'] },
        width: '宽度',
        defaultValue: '默认值',
      },
    },
  },
};

export const TableGroupTableColumn = {
  'zh-CN': {
    title: '表格列',
    settings: {
      'x-component-props': {
        title: '标题',
        align: {
          title: '内容对齐',
          dataSource: ['左', '右', '居中'],
        },
        colSpan: '跨列',
        width: '宽度',
        fixed: {
          title: '固定',
          dataSource: ['左', '右', '无'],
        },
        hideInSearch: '在表单中隐藏',
        type: {
          title: '表单类型',
          dataSource: ['文本框', '下拉框', '日期区间'],
        },
        options: '表单可选项',
      },
    },
  },
};

export const TableGroupPagination = {
  'zh-CN': {
    title: '分页',
    addColumn: '添加列',
    settings: {
      'x-component-props': {
        showSizeChanger: '页面大小切换器',
        showQuickJumper: '快速跳转',
      },
    },
  },
};
