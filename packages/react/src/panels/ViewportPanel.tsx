import React, { PropsWithChildren } from 'react';
import { WorkspacePanel, IWorkspaceItemProps } from './WorkspacePanel';
import { Simulator } from '../containers';
export const ViewportPanel: React.FC<PropsWithChildren<IWorkspaceItemProps>> = (props) => {
  return (
    <WorkspacePanel.Item {...props} flexable>
      <Simulator>{props.children}</Simulator>
    </WorkspacePanel.Item>
  );
};
