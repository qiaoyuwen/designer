import { FunctionComponent } from 'react';
import { Button as AntdButton } from 'antd';

export const Button: FunctionComponent<React.ComponentProps<typeof AntdButton> & { text?: string }> = (props) => {
  return <AntdButton {...props}>{props.text || '空文本'}</AntdButton>;
};
