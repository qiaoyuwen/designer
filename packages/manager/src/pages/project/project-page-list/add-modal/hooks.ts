import { ProjectPage } from '@/models';
import { ProjectPageServices } from '@/services';
import { useCallback } from 'react';

export interface AddModalProps {
  visible: boolean;
  formData?: Partial<ProjectPage>;
  onOk: () => void;
  onCancel: () => void;
}

export const useProjectAddModal = (props: AddModalProps) => {
  const { formData } = props;
  const submit = useCallback(
    async (data: ProjectPage) => {
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
