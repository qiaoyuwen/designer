import React from 'react';
import { ScreenType } from '@designer/core';
import { requestIdle } from '@designer/utils';
import { observer } from '@formily/reactive-react';
import { useScreen } from '../hooks';
import { PCSimulator /* MobileSimulator, , ResponsiveSimulator */ } from '../simulators';

export type ISimulatorProps = React.HTMLAttributes<HTMLDivElement>;

export const Simulator: React.FC<ISimulatorProps> = observer(
  (props: ISimulatorProps) => {
    const screen = useScreen();
    if (screen.type === ScreenType.PC) return <PCSimulator {...props}>{props.children}</PCSimulator>;
    // TODO
    /* if (screen.type === ScreenType.Mobile) return <MobileSimulator {...props}>{props.children}</MobileSimulator>;
    if (screen.type === ScreenType.Responsive)
      return <ResponsiveSimulator {...props}>{props.children}</ResponsiveSimulator>; */
    return <PCSimulator {...props}>{props.children}</PCSimulator>;
  },
  {
    scheduler: requestIdle,
  },
);
