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
} from '@designer/react';
import { saveSchema } from '@/service';
import { ActionsWidget, LogoWidget } from '@/widgets';
import { Form, Field, Input, Password, NumberPicker, Select, TreeSelect, Cascader } from '@/components';
import { SettingsForm, setNpmCDNRegistry } from '@designer/react-settings-form';

setNpmCDNRegistry('//unpkg.com');

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
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
              sources={[Input, Password, NumberPicker, Select, TreeSelect, Cascader]}
            />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel></ToolbarPanel>
            <ViewportPanel style={{ height: '100%' }}>
              <ViewPanel type="DESIGNABLE">
                {() => {
                  return (
                    <ComponentTreeWidget
                      components={{ Form, Field, Input, Password, NumberPicker, Select, TreeSelect, Cascader }}
                    />
                  );
                }}
              </ViewPanel>
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
