import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api/api';
import { HttpMethod, type User } from '../types';

const useUpdateUserProfile = ({
  data,
  userName,
}: {
  data: User;
  userName: string;
}) => {
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: () =>
      api({
        data,
        endpoint: '/users/update',
        method: HttpMethod.PUT,
        successMessage: 'Profile updates successfully',
      }),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
        queryClient.invalidateQueries({ queryKey: [userName] }),
      ]);
    },
  });
  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
