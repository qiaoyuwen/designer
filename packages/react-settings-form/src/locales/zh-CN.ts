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
    },
  },
};
