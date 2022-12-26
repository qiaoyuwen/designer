import { FunctionComponent, Fragment, useState, useMemo } from 'react';
import { TextWidget } from '@designer/react';
import { Button, Modal } from 'antd';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { FormDataSettingForm } from './FormDataSettingForm';
import { DataType, IRequstConfig } from '../RequestSetter';

interface IFormDataSetterProps {
  value?: IRequstConfig;
  onChange: (value: IRequstConfig) => void;
}

export const FormDataSetter: FunctionComponent<IFormDataSetterProps> = observer((props) => {
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
        <TextWidget token={`SettingComponents.FormDataSetter.configureRequest`} />
      </Button>
      <Modal
        title={<TextWidget token={`SettingComponents.FormDataSetter.configureRequest`} />}
        width="65%"
        bodyStyle={{ padding: 10 }}
        destroyOnClose
        transitionName=""
        maskTransitionName=""
        visible={modalVisible}
        onCancel={closeModal}
        onOk={() => {
          onChange(
            requestConfig.dataType === DataType.Static
              ? {
                  dataType: requestConfig.dataType,
                  dataSource: requestConfig.dataSource,
                }
              : {
                  dataType: requestConfig.dataType,
                  url: requestConfig.url,
                },
          );
          closeModal();
        }}
      >
        <FormDataSettingForm requstConfig={requestConfig} />
      </Modal>
    </Fragment>
  );
});
