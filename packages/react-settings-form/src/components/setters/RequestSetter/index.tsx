import { FunctionComponent, Fragment, useState, useMemo } from 'react';
import { TextWidget } from '@designer/react';
import { Button, Modal } from 'antd';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { RequestSettingForm } from './RequestSettingForm';

export interface IRequstConfig {
  url: string;
}

interface IRequestSetterProps {
  value?: IRequstConfig;
  onChange: (value: IRequstConfig) => void;
}

export const RequestSetter: FunctionComponent<IRequestSetterProps> = observer((props) => {
  const { value, onChange } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const requestConfig: IRequstConfig = useMemo(() => {
    return observable({
      ...value,
    });
  }, [value, modalVisible]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <Fragment>
      <Button block onClick={openModal}>
        <TextWidget token={`SettingComponents.RequestSetter.configureRequest`} />
      </Button>
      <Modal
        title={<TextWidget token={`SettingComponents.RequestSetter.configureRequest`} />}
        width="65%"
        bodyStyle={{ padding: 10 }}
        transitionName=""
        maskTransitionName=""
        visible={modalVisible}
        onCancel={closeModal}
        onOk={() => {
          onChange(requestConfig);
          closeModal();
        }}
      >
        <RequestSettingForm requstConfig={requestConfig} />
      </Modal>
    </Fragment>
  );
});
