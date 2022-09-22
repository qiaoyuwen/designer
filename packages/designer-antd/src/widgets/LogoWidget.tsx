import React from 'react';
import { useTheme } from '@designer/react';

const logo = {
  dark: 'Designer',
  light: 'Designer',
};

export const LogoWidget: React.FC = () => {
  const theme = useTheme();
  let url = logo.dark;
  if (theme === 'dark') {
    url = logo.dark;
  }
  if (theme === 'light') {
    url = logo.light;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, fontWeight: 700 }}>
      {
        // <img src={url} style={{ margin: '12px 8px', height: 18, width: 'auto' }} />
      }
      <div>{url}</div>
    </div>
  );
};
