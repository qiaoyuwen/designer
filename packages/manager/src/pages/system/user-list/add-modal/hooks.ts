import { User } from '@/models';
import { UserServices } from '@/services';
import { useCallback } from 'react';

export interface AddModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const useUserAddModal = (props: AddModalProps) => {
  const submit = useCallback(async (data: User) => {
    await UserServices.addUser({
      username: data.username,
    });
  }, []);

  return [
    {
      submit,
    },
  ] as const;
};
