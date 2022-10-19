import { ProjectPageServices } from '@/services';
import { useCallback } from 'react';

export interface FormDataType {
  id?: string;
  name?: string;
  projectId?: string;
  description?: string;
}

export interface AddModalProps {
  visible: boolean;
  formData?: FormDataType;
  onOk: () => void;
  onCancel: () => void;
}

export const useProjectAddModal = (props: AddModalProps) => {
  const { formData } = props;
  const submit = useCallback(
    async (data: FormDataType) => {
      if (formData?.id) {
        await ProjectPageServices.updateProjectPage({
          ...data,
          id: formData.id,
        });
      } else {
        await ProjectPageServices.addProjectPage(data);
      }
    },
    [formData],
  );

  return [
    {
      submit,
    },
  ] as const;
};
