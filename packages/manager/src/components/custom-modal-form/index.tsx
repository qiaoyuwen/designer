import { useCustomModalForm, CustomModalFormProps } from '@/hooks';
import { ModalForm } from '@ant-design/pro-form';
import type { PropsWithChildren } from 'react';

function CustomModalForm<T>(props: PropsWithChildren<CustomModalFormProps<T>>) {
  const { title, visible, onCancel, width = 600 } = props;
  const { form, onFinish } = useCustomModalForm(props);
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <ModalForm<T>
      width={width}
      title={title}
      form={form}
      visible={visible}
      onFinish={onFinish}
      modalProps={{
        onCancel,
      }}
      layout="horizontal"
      onFinishFailed={props.onFailed}
      {...formItemLayout}
      submitter={{
        submitButtonProps: {
          disabled: props.submitDisabled,
        },
      }}
    >
      {props.children}
    </ModalForm>
  );
}

export default CustomModalForm;
