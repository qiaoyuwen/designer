import 'antd/dist/antd.less';
import { FunctionComponent, useMemo } from 'react';
import { createDesigner, GlobalRegistry, IEngineContext, KeyCode, Shortcut } from '@designer/core';
import { Designer, StudioPanel, CompositePanel, ResourceWidget } from '@designer/react';
import { saveSchema } from '@/service';
import { ActionsWidget, LogoWidget } from '@/widgets';
import { Input } from '@/components';

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
            <ResourceWidget title="sources.Inputs" sources={[Input]} />
          </CompositePanel.Item>
        </CompositePanel>
      </StudioPanel>
    </Designer>
  );
};

export default HomePage;
