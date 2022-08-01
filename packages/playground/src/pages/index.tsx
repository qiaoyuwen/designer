import 'antd/dist/antd.less';
import { FunctionComponent, useMemo } from 'react';
import { createDesigner, IEngineContext, KeyCode, Shortcut } from '@designer/core';
import { Designer, StudioPanel, CompositePanel } from '@designer/react';
import { saveSchema } from '@/service';
import { ActionsWidget, LogoWidget } from '@/widgets';

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
          <CompositePanel.Item title="panels.Component" icon="Component"></CompositePanel.Item>
        </CompositePanel>
      </StudioPanel>
    </Designer>
  );
};

export default HomePage;
