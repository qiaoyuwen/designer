import { Modal as AntdModal, ConfigProvider } from 'antd';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import zh_CN from 'antd/lib/locale/zh_CN';

export const Modal: FunctionComponent<React.ComponentProps<typeof AntdModal>> = (props) => {
  const [visible, setVisible] = useState<boolean>(props.visible);

  const defalutCloseModal = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  return (
    <ConfigProvider locale={zh_CN}>
      <AntdModal {...props} visible={visible} onCancel={props.onCancel || defalutCloseModal} />
    </ConfigProvider>
  );
};
