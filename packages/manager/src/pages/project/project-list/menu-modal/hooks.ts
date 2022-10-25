import { Project } from '@/models';
import { ProjectServices } from '@/services';
import { useCallback } from 'react';

export interface MenuConfigModalProps {
  visible: boolean;
  formData: Project;
  onOk: () => void;
  onCancel: () => void;
}

export const useProjectMenuConfigModal = (props: MenuConfigModalProps) => {
  const { formData } = props;
  const submit = useCallback(
    async (data: Project) => {
      await ProjectServices.updateProject({
        ...data,
        id: formData.id,
      });
    },
    [formData],
  );

  return [
    {
      submit,
    },
  ] as const;
};
