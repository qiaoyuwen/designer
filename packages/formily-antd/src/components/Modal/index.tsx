import { Modal as AntdModal, ConfigProvider } from 'antd';
import { FunctionComponent, useCallback } from 'react';
import zh_CN from 'antd/lib/locale/zh_CN';
import { useField } from '@formily/react';
import { ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

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

interface IConfirmModalProps {
  visible?: boolean;
  icon?: 'info' | 'success' | 'error' | 'warning';
  title?: string;
  getContainer?: () => HTMLElement;
}

export const ConfirmModal: FunctionComponent<IConfirmModalProps> = (props) => {
  const { icon } = props;
  const field = useField();

  const defalutCloseModal = useCallback(() => {
    field.setComponentProps({
      visible: false,
    });
  }, []);

  const renderIcon = () => {
    if (icon === 'info') {
      return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />;
    }
    if (icon === 'success') {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
    if (icon === 'error') {
      return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
    }
    return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
  };

  return (
    <ConfigProvider locale={zh_CN}>
      <AntdModal
        {...props}
        title={null}
        visible={props.visible}
        closable={false}
        getContainer={props.getContainer}
        onCancel={defalutCloseModal}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: 16, fontSize: 22 }}>{renderIcon()}</div>
          <span
            style={{
              display: 'block',
              overflow: 'hidden',
              color: '#000000d9',
              fontWeight: 500,
              fontSize: 16,
              lineHeight: 1.4,
            }}
          >
            {props.title}
          </span>
        </div>
      </AntdModal>
    </ConfigProvider>
  );
};
