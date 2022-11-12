# FoundBegin-Lowcodeengine

![cmd-markdown-logo](/logo.png)

## 目录结构

    ├── common                       // rush 配置和临时文件
    │   └── temp                     // rush 临时文件，如果无法运行请删除
    └── packages
        ├── core                     // designable 核心
        ├── designer-antd            // 设计器组件
        ├── formily-antd             // 左侧-自定义组件
        ├── manager                  // 主工程
        ├── playground               // 调试编辑器
        ├── react                    // 编辑器内的组件
        ├── react-settings-form      // 右侧-表单编辑

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
