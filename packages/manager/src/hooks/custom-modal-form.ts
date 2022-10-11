import type { FormInstance } from 'antd';
import { message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect } from 'react';
import lodash from 'lodash';
import moment from 'moment';

export interface CustomModalFormTransformField {
  origin: 'string';
  transform: 'file' | 'date';
  fileProperty?: string;
  dateFormat?: string;
}

export interface ValidateErrorEntity<T> {
  values: T;
  errorFields: {
    name: (string | number)[];
    errors: string[];
  }[];
  outOfDate: boolean;
}

export interface CustomModalFormProps<T> {
  title: string;
  visible: boolean;
  isEdit?: boolean;
  form?: FormInstance<T>;
  formData?: Partial<T>;
  onOk: () => void;
  onCancel: () => void;
  onFailed?: (errorInfo: ValidateErrorEntity<T>) => void;
  submit: (data: T) => Promise<void>;
  transformField?: Record<string, CustomModalFormTransformField>;
  width?: number;
  submitDisabled?: boolean;
}

export function useCustomModalForm<T>(props: Omit<CustomModalFormProps<T>, 'title'>) {
  const { formData, onOk, submit, transformField, isEdit, visible } = props;
  const [newForm] = useForm<T>();
  const form = props.form || newForm;

  const initFormData = useCallback(() => {
    if (!visible) {
      return;
    }
    if ((isEdit === undefined && !formData) || isEdit === false) {
      form.resetFields();
    } else {
      form.resetFields();
      const initData = { ...formData };
      // 转换参数
      if (transformField) {
        Object.keys(transformField).forEach((key) => {
          if (lodash.isNil(initData[key])) {
            return;
          }
          if (transformField[key].transform === 'file') {
            initData[key] = [
              {
                name: initData[key],
                status: 'done',
              },
            ];
          }
          if (transformField[key].transform === 'date') {
            initData[key] = moment(initData[key], transformField[key].dateFormat || 'YYYY-MM-DD HH:mm:ss');
          }
        });
      }
      form.setFieldsValue(initData as any);
    }
  }, [form, formData, isEdit, transformField, visible]);

  const onFinish = useCallback(
    async (data: T) => {
      // 转换参数
      const transformData = { ...data };
      if (transformField) {
        Object.keys(transformField).forEach((key) => {
          if (!transformData[key]) {
            return;
          }
          if (transformField[key].transform === 'file') {
            const value = data[key][0];
            transformData[key] = value.name;
            if (transformField[key].fileProperty) {
              transformData[transformField[key].fileProperty!] = value.originFileObj;
            }
          }
        });
      }
      await submit(transformData);
      message.success('操作成功');
      onOk();
    },
    [onOk, submit, transformField],
  );

  useEffect(() => {
    initFormData();
  }, [initFormData]);

  return {
    form,
    onFinish,
  } as const;
}
