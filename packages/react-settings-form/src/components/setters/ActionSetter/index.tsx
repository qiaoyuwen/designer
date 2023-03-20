import { FunctionComponent, Fragment, useState, useMemo } from 'react';
import { Button, Modal } from 'antd';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { ActionSettingForm } from './ActionSettingForm';

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

export enum ActionConfigType {
  Enum = 'Enum',
  Custom = 'Custom',
}

export enum ActionType {
  JumpPage = 'JumpPage',
}

export interface IActionConfig {
  actionConfigType: ActionConfigType;
  config?: {
    actionType: ActionType;
    params: {
      pageId: string;
    };
    generateFunc?: string;
  };
  customFunc?: string;
}

interface IRequestSetterProps {
  value?: IActionConfig;
  onChange: (value: IActionConfig) => void;
}

export const ActionSetter: FunctionComponent<IRequestSetterProps> = observer((props) => {
  const { value, onChange } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const actionConfig: IActionConfig = useMemo(() => {
    return observable({
      ...value,
      customFunc: value?.customFunc ? toInputValue(value.customFunc) : undefined,
    });
  }, [value, modalVisible]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <Fragment>
      <Button block onClick={openModal}>
        配置动作
      </Button>
      <Modal
        destroyOnClose
        title="配置动作"
        width="65%"
        bodyStyle={{ padding: 10 }}
        transitionName=""
        maskTransitionName=""
        visible={modalVisible}
        onCancel={closeModal}
        onOk={() => {
          if (actionConfig.actionConfigType === ActionConfigType.Enum) {
            if (actionConfig.config.actionType === ActionType.JumpPage) {
              actionConfig.config.generateFunc = `{{() => UmiHistory.push('${actionConfig.config?.params?.pageId}')}}`;
            }
          }
          onChange({
            ...actionConfig,
            customFunc: actionConfig?.customFunc ? toChangeValue(actionConfig.customFunc) : undefined,
          });
          closeModal();
        }}
      >
        <ActionSettingForm actionConfig={actionConfig} />
      </Modal>
    </Fragment>
  );
});
