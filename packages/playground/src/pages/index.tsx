import 'antd/dist/antd.less';
import { FunctionComponent, useMemo } from 'react';
import { createDesigner, IEngineContext, KeyCode, Shortcut } from '@designer/core';
import { Designer, StudioPanel } from '@designer/react';
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
      <StudioPanel logo={<LogoWidget />} actions={<ActionsWidget />}></StudioPanel>
    </Designer>
  );
};

export default HomePage;
