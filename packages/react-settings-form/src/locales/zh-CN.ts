const ValidatorFormats = [
  { label: 'URL地址', value: 'url' },
  { label: '邮箱格式', value: 'email' },
  { label: '数字格式', value: 'number' },
  { label: '整数格式', value: 'integer' },
  { label: '身份证格式', value: 'idcard' },
  { label: '手机号格式', value: 'phone' },
  { label: '货币格式', value: 'money' },
  { label: '中文格式', value: 'zh' },
  { label: '日期格式', value: 'date' },
  { label: '邮编格式', value: 'zip' },
];

export default {
  'zh-CN': {
    settings: {
      'x-validator': {
        title: '校验规则',
        addValidatorRules: '添加校验规则',
        drawer: '配置规则',
        triggerType: {
          title: '触发类型',
          placeholder: '请选择',
          dataSource: ['输入时', '聚焦时', '失焦时'],
        },
        format: {
          title: '格式校验',
          placeholder: '请选择',
          dataSource: ValidatorFormats,
        },
        validator: {
          title: '自定义校验器',
          tooltip: '格式: function (value){ return "Error Message"}',
        },
        pattern: '正则表达式',
        len: '长度限制',
        max: '长度/数值小于',
        min: '长度/数值大于',
        exclusiveMaximum: '长度/数值小于等于',
        exclusiveMinimum: '长度/数值大于等于',
        whitespace: '不允许空白符',
        required: '是否必填',
        message: {
          title: '错误消息',
          tooltip: '错误消息只对当前规则集的一个内置规则生效，如果需要对不同内置规则定制错误消息，请拆分成多条规则',
        },
      },
    },
    SettingComponents: {
      ValueInput: {
        expression: '表达式',
      },
      MonacoInput: {
        helpDocument: '帮助文档',
      },
      SelectionInput: {
        // SizeInput
        inherit: '继承',
        auto: '自动',
        // TableColumnWidthSizeInput
        undefined: '自动',
        // ValueInput
        text: '文本',
        expression: '表达式',
        boolean: '布尔值',
        number: '数值',
      },
      ValidatorSetter: {
        pleaseSelect: '请选择',
        formats: ValidatorFormats,
      },
      DataSourceSetter: {
        nodeProperty: '节点属性',
        pleaseSelectNode: '请先选择左侧树节点',
        addKeyValuePair: '添加键值对',
        configureDataSource: '配置可选项',
        dataSource: '可选项',
        defaultTitle: '默认标题',
        dataSourceTree: '可选项节点树',
        jsonPanel: 'JSON映射',
        addNode: '新增节点',
        removeNode: '移除节点',
        label: '选项标签',
        value: '选项值',
        disabled: '禁用',
        item: '选项',
        dataSourceTab: '节点配置',
        jsonTab: 'JSON配置',
      },
      TableColumnsSetter: {
        nodeProperty: '列属性',
        pleaseSelectNode: '请先选择左侧树节点',
        configureDataSource: '配置表格列',
        dataSource: '表格列',
        defaultTitle: '默认标题',
        dataSourceTree: '表格列节点树',
        jsonPanel: 'JSON映射',
        addNode: '新增列',
        removeNode: '移除列',
        item: '列',
        dataSourceTab: '列配置',
        jsonTab: 'JSON配置',
        title: '列名',
        dataIndex: '数据索引',
        width: '宽度',
        hideInSearch: '在表单中隐藏',
      },
      RequestSetter: {
        configureRequest: '配置数据源',
        RequestSettingForm: {
          url: '请求地址',
        },
      },
    },
  },
};
