import { Role } from '@/models';
import { RoleServices } from '@/services';
import { useCallback } from 'react';

export interface AddModalProps {
  visible: boolean;
  formData?: Partial<Role>;
  onOk: () => void;
  onCancel: () => void;
}

export const useRoleAddModal = (props: AddModalProps) => {
  const { formData } = props;
  const submit = useCallback(
    async (data: Role) => {
      if (formData?.id) {
        await RoleServices.updateRole({
          ...data,
          id: formData.id,
        });
      } else {
        await RoleServices.addRole(data);
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
