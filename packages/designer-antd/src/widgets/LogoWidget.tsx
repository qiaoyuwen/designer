import React from 'react';
import { useTheme } from '@designer/react';

interface ILogoWidgetProps {
  title?: string;
}

export const LogoWidget: React.FC<ILogoWidgetProps> = (props) => {
  const theme = useTheme();

  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, fontWeight: 700 }}>
      <div>{props.title || 'Designer'}</div>
    </div>
  );
};
