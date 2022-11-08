import { FunctionComponent, useMemo } from 'react';
import { Button as AntdButton } from 'antd';

enum ActionConfigType {
  Enum = 'Enum',
  Custom = 'Custom',
}

enum ActionType {
  JumpPage = 'JumpPage',
}
interface IActionConfig {
  actionConfigType: ActionConfigType;
  config?: {
    actionType: ActionType;
    params: {
      pageId: string;
    };
    generateFunc?: () => void;
  };
  customFunc?: () => void;
}

export interface IButtonProps {
  text?: string;
  actionConfig?: IActionConfig;
}

export const Button: FunctionComponent<React.ComponentProps<typeof AntdButton> & IButtonProps> = (props) => {
  const { onClick, actionConfig, ...extraProps } = props;

  const realOnClick = useMemo(() => {
    if (actionConfig) {
      if (actionConfig.actionConfigType === ActionConfigType.Custom) {
        return actionConfig.customFunc;
      } else {
        if (actionConfig.config.actionType === ActionType.JumpPage) {
          return actionConfig.config.generateFunc;
        }
      }
    }
    return onClick;
  }, [onClick, actionConfig]);

  return (
    <AntdButton {...extraProps} onClick={realOnClick}>
      {props.text || '空文本'}
    </AntdButton>
  );
};
