import 'antd/dist/antd.less';
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
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
  OutlineTreeWidget,
} from '@designer/react';
import { saveSchema } from './service';
import { ActionsWidget, LogoWidget, MarkupSchemaWidget, SchemaEditorWidget, RouterWidget } from './widgets';
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
  Switch,
  Slider,
  Rate,
  Upload,
  DatePicker,
} from './components';
import { BaseLayout, Card, Modal, ConfirmModal, Divider } from './layouts';
import { Table, Text, Tabs, Statistic } from './data-display';
import { Button } from './operations';
import { SettingsForm, setNpmCDNRegistry } from '@designer/react-settings-form';
import './global.less';

setNpmCDNRegistry('//unpkg.com');

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '表单组件',
      Layouts: '布局组件',
      DataDisplays: '数据展示组件',
      Operations: '操作组件',
    },
  },
});

export interface IDesignerAntdProps {
  title?: string;
  initialSchema?: string;
  initialRouterData?: string;
  onSave?: (schemaJson: string, routerJson: string) => Promise<void>;
  onPreview?: (schemaJson: string, routerJson: string) => Promise<void>;
  onBack?: () => void;
  pageOptions?: { value: string; label: string }[];
  onRouterSelect?: (pageId: string) => void;
}

export const DesignerAntd: FunctionComponent<IDesignerAntdProps> = (props) => {
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
  const routerRef = useRef<any[]>([]);

  useEffect(() => {
    try {
      if (props.initialRouterData) {
        routerRef.current = JSON.parse(props.initialRouterData);
      }
    } catch {}
  }, [props.initialSchema]);

  const onRouterChange = (newRouter: any[]) => {
    routerRef.current = newRouter;
  };

  const onSave = async (schemaJson: string) => {
    let routerJson = '[]';
    try {
      routerJson = JSON.stringify(routerRef.current);
    } catch {}

    props.onSave(schemaJson, routerJson);
  };

  const onPreview = async (schemaJson: string) => {
    let routerJson = '[]';
    try {
      routerJson = JSON.stringify(routerRef.current);
    } catch {}

    props.onPreview(schemaJson, routerJson);
  };

  return (
    <Designer engine={engine}>
      <StudioPanel
        logo={<LogoWidget title={props.title} />}
        actions={
          <ActionsWidget
            onSave={onSave}
            onPreview={onPreview}
            initialSchema={props.initialSchema}
            onBack={props.onBack}
          />
        }
      >
        <CompositePanel>
          <CompositePanel.Item title="panels.Component" icon="Component">
            <ResourceWidget
              title="sources.Inputs"
              sources={[
                Input,
                Password,
                NumberPicker,
                Select,
                TreeSelect,
                Cascader,
                Checkbox,
                Radio,
                Switch,
                Slider,
                Rate,
                DatePicker,
                Upload,
              ]}
            />
            <ResourceWidget title="sources.Layouts" sources={[BaseLayout, Card, Modal, ConfirmModal, Divider]} />
            <ResourceWidget title="sources.DataDisplays" sources={[Table, Text, Tabs, Statistic]} />
            <ResourceWidget title="sources.Operations" sources={[Button]} />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.Router" icon="Design">
            <RouterWidget
              value={props.initialRouterData}
              pageOptions={props.pageOptions}
              onSelect={props.onRouterSelect}
              onChange={onRouterChange}
            />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel>
              <div />
              <ViewToolsWidget use={['DESIGNABLE', 'JSONTREE', 'MARKUP']} />
            </ToolbarPanel>
            <ViewportPanel style={{ height: '100%' }}>
              <ViewPanel type="DESIGNABLE">
                {() => {
                  const components = {
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
                    Switch,
                    Slider,
                    Rate,
                    DatePicker,
                    Upload,
                    Table,
                    Modal,
                    ConfirmModal,
                    Button,
                    Text,
                    Tabs,
                    Divider,
                    Statistic,
                  };
                  GlobalRegistry.registerDesignerBehaviors(components);

                  return <ComponentTreeWidget components={components} />;
                }}
              </ViewPanel>
              <ViewPanel type="JSONTREE" scrollable={false}>
                {(tree, onChange) => <SchemaEditorWidget tree={tree} onChange={onChange} />}
              </ViewPanel>
              <ViewPanel type="MARKUP" scrollable={false}>
                {(tree) => <MarkupSchemaWidget tree={tree} />}
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
