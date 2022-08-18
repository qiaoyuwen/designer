/* eslint-disable @typescript-eslint/no-explicit-any */
import 'antd/dist/antd.less';
import { FunctionComponent, useMemo } from 'react';
import { createDesigner, GlobalRegistry, IEngineContext, KeyCode, Shortcut } from '@designer/core';
import {
  Designer,
  StudioPanel,
  CompositePanel,
  ResourceWidget,
  Workspace,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  ComponentTreeWidget,
  SettingsPanel,
  ViewToolsWidget,
} from '@designer/react';
import { saveSchema } from '@/service';
import { ActionsWidget, LogoWidget, MarkupSchemaWidget, PreviewWidget, SchemaEditorWidget } from '@/widgets';
import {
  Form,
  Field,
  Input,
  Password,
  NumberPicker,
  Select,
  TreeSelect,
  Cascader,
  Checkbox,
  Radio,
} from '@/components';
import { BaseLayout, Card } from '@/layouts';
import { SettingsForm, setNpmCDNRegistry } from '@designer/react-settings-form';

setNpmCDNRegistry('//unpkg.com');

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '表单组件',
      Layouts: '布局组件',
    },
  },
});

const HomePage: FunctionComponent = () => {
  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx: IEngineContext) {
              saveSchema(ctx.engine);
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    [],
  );

  return (
    <Designer engine={engine}>
      <StudioPanel logo={<LogoWidget />} actions={<ActionsWidget />}>
        <CompositePanel>
          <CompositePanel.Item title="panels.Component" icon="Component">
            <ResourceWidget
              title="sources.Inputs"
              sources={[Input, Password, NumberPicker, Select, TreeSelect, Cascader, Checkbox, Radio]}
            />
            <ResourceWidget title="sources.Layouts" sources={[BaseLayout, Card]} />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel>
              <div></div>
              <ViewToolsWidget use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']} />
            </ToolbarPanel>
            <ViewportPanel style={{ height: '100%' }}>
              <ViewPanel type="DESIGNABLE">
                {() => {
                  return (
                    <ComponentTreeWidget
                      components={{
                        Form,
                        Field,
                        Input,
                        Password,
                        NumberPicker,
                        Select,
                        TreeSelect,
                        Cascader,
                        Checkbox,
                        Radio,
                        BaseLayout,
                        Card,
                      }}
                    />
                  );
                }}
              </ViewPanel>
              <ViewPanel type="JSONTREE" scrollable={false}>
                {(tree, onChange) => <SchemaEditorWidget tree={tree} onChange={onChange} />}
              </ViewPanel>
              <ViewPanel type="MARKUP" scrollable={false}>
                {(tree) => <MarkupSchemaWidget tree={tree} />}
              </ViewPanel>
              <ViewPanel type="PREVIEW">{(tree) => <PreviewWidget tree={tree} />}</ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm />
        </SettingsPanel>
      </StudioPanel>
    </Designer>
  );
};

export default HomePage;
