/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, PropsWithChildren } from 'react';
import { observer } from '@formily/reactive-react';
import { DroppableWidget } from '@designer/react';
import './styles.less';

export const Container: FunctionComponent<PropsWithChildren> = observer((props) => {
  return <DroppableWidget>{props.children}</DroppableWidget>;
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return ({ style, ...props }: any) => {
    return (
      <DroppableWidget style={style}>
        <Target {...props} />
      </DroppableWidget>
    );
  };
};
