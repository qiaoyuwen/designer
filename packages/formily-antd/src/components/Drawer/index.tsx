import { Drawer as AntdDrawer } from 'antd';
import { FunctionComponent, useCallback } from 'react';
import { useField } from '@formily/react';

export const Drawer: FunctionComponent<React.ComponentProps<typeof AntdDrawer>> = (props) => {
  const field = useField();

  const defalutClose = useCallback(() => {
    field.setComponentProps({
      visible: false,
    });
  }, []);

  return <AntdDrawer {...props} onClose={props.onClose || defalutClose} />;
};
