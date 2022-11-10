import { FunctionComponent, Fragment, useState, useMemo } from 'react';
import { TextWidget } from '@designer/react';
import { Button, Modal } from 'antd';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { RequestSettingForm } from './RequestSettingForm';

const EXPRESSION_REX = /^\{\{([\s\S]*)\}\}$/;

const toInputValue = (value: string) => {
  if (!value || value === '{{}}') return;
  const matched = String(value).match(EXPRESSION_REX);
  return matched?.[1] || value || '';
};

const toChangeValue = (value: string) => {
  if (!value || value === '{{}}') return;
  const matched = String(value).match(EXPRESSION_REX);
  return `{{${matched?.[1] || value || ''}}}`;
};

export enum DataType {
  Static = 'static',
  Dynamic = 'dynamic',
}

export interface IRequstConfig {
  dataType: DataType;
  dataSource?: string;
  url?: string;
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
      dataSource: toInputValue(value.dataSource),
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
                  dataSource: toChangeValue(requestConfig.dataSource),
                }
              : {
                  dataType: requestConfig.dataType,
                  url: requestConfig.url,
                },
          );
          closeModal();
        }}
      >
        <RequestSettingForm requstConfig={requestConfig} />
      </Modal>
    </Fragment>
  );
});
