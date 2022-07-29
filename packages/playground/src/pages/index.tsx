import { FunctionComponent, useMemo } from 'react';
import { createDesigner } from '@designer/core';
import { Designer } from '@designer/react';

const HomePage: FunctionComponent = () => {
  const engine = useMemo(
    () =>
      createDesigner({
        // TODO
        /* shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              saveSchema(ctx.engine)
            },
          }),
        ], */
        rootComponentName: 'Form',
      }),
    [],
  );

  return <Designer engine={engine}></Designer>;
};

export default HomePage;
