import { Modal as AntdModal, ConfigProvider } from 'antd';
import { FunctionComponent, useCallback } from 'react';
import zh_CN from 'antd/lib/locale/zh_CN';
import { useField } from '@formily/react';

export const Modal: FunctionComponent<React.ComponentProps<typeof AntdModal>> = (props) => {
  const field = useField();

  const defalutCloseModal = useCallback(() => {
    field.setComponentProps({
      visible: false,
    });
  }, []);

  return (
    <ConfigProvider locale={zh_CN}>
      <AntdModal {...props} onCancel={props.onCancel || defalutCloseModal} />
    </ConfigProvider>
  );
};
