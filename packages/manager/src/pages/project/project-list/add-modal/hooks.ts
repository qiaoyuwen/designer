import { Project } from '@/models';
import { ProjectServices } from '@/services';
import { useCallback } from 'react';

export interface AddModalProps {
  visible: boolean;
  formData?: Partial<Project>;
  onOk: () => void;
  onCancel: () => void;
}

export const useProjectAddModal = (props: AddModalProps) => {
  const { formData } = props;
  const submit = useCallback(
    async (data: Project) => {
      if (formData?.id) {
        await ProjectServices.updateProject({
          ...data,
          id: formData.id,
        });
      } else {
        await ProjectServices.addProject(data);
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
