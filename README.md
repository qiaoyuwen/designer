# FoundBegin-Lowcodeengine

![cmd-markdown-logo](/logo.png)

## 目录结构

    ├── common                            //【工程管理】- 配置和临时文件
    │   └── temp                          //【工程管理】- 临时文件，如果无法运行请删除
    └── packages
        ├── manager                       //【主工程】
        ├── core                          //【编辑器】- 核心骨架(designable)
        ├── designer-antd                 //【组件】
        │   └── src
        │       ├── components            //【组件注册】- 表单组件
        │       ├── layouts               //【组件注册】- 布局组件
        │       ├── data-display          //【组件注册】- 数据展示组件
        │       ├── operations            //【组件注册】- 交互组件
        │       ├── locales               //【组件注册】- 国际化
        │       ├── schemas               //【组件注册】- 配置项
        │       ├── designer.tsx          //【组件注册】- 编辑器
        │       └── widgets
        │           └── PreviewWidget.tsx //【组件注册】- 预览页
        ├── formily-antd                  //【组件】- 源码（自定义组件）
        ├── playground                    //【组件】- 开发调试（纯前端）
        ├── react                         //【编辑面板】- 编辑项组件
        ├── react-settings-form           //【编辑面板】- 扩展编辑项组件

## 依赖性

<img src='/document/img/lowcodeengine-frame.png' />

#### ./packages/core

```
@designer/core
```

#### ./packages/designer-antd

```
@designer/designer-antd
```

#### ./packages/formily-antd

```
@designer/formily-antd
```

#### ./packages/react

```
@designer/react
```

#### ./packages/react-settings-form

```
@designer/react-settings-form
```

## 初始化

全局安装 rush

```bash
yarn global add @microsoft/rush #或 npm install -g @microsoft/rush
```

## 第一次 clone 项目需要执行的流程

```bash
rush update # 更新依赖
rush update-autoinstaller --name rush-lint # 更新自动安装文件夹依赖
```

## 工作流

```bash
# 从 git 拉取最新变更
$ git pull

# 更新 NPM 依赖
$ rush update

# 如果出错可以尝试
$ rm -rf ./common/temp && rush update --full

# 重新打包 @designer/manager 依赖的项目（不含包其本身）
## 主工程
$ rush rebuild -T @designer/manager

# 进入指定项目目录
$ cd ./packages/manager

# 单独打包 (包目录下)
$ rushx build

# 启动项目 ​
$ rushx start # or rushx xxx
```

## rush 文档地址

[rush 文档](https://rushjs.io/zh-cn/pages/intro/welcome/)

## 组件的注册

#### ./packages/designer-antd/src/operations/Button/preview.tsx

```ts
/** 加载真实的组件 */
import { Button as FormilyButton } from '@designer/formily-antd'
...

/** 组件映射 */
export const Button: DnFC<React.ComponentProps<typeof FormilyButton>> = (props) => {
  return <FormilyButton {...props} onClick={() => { }} actionConfig={undefined} />;
};

/** 编辑面板属性 */
Button.Behavior = createBehavior({
  name: 'Button',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Button',
  /** schema描述 */
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Button),
  },
  /** 国际化 */
  designerLocales: AllLocales.Button,
});

/** 注册渲染的内容 */
Button.Resource = createResource({
  icon: 'Text',
  /** 可以在容器内渲染多个组件 */
  elements: [
    {
      /** 渲染的容器名称 */
      componentName: 'Field',
      props: {
        type: 'void',
        /** 组件 */
        'x-component': 'Button',
        /** 组件初始化属性 */
        'x-component-props': {
          text: 'vertical',
        },
      },
    },
  ],
});
```

## 相关链接

- designable  
  https://github.com/alibaba/designable

- bigdata-screen-template(静态版)  
  http://bigdata-screen-v3-dev.gogdev.cn/

- lowcode-engine(体验版)  
  http://bigdata-screen-v3-bus.gogdev.cn/

- document(dev)  
  http://foundbyte-bigdata-docs-dev.gogdev.cn/

- rushjs + dumi + webpack_template  
  http://10.10.11.151:20216/teg/core-front-ends/interior-open-common/documents-template
