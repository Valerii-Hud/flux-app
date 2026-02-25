import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api/api';
import { HttpMethod } from '../types';

const useFollow = () => {
  const queryClient = useQueryClient();
  const { mutate: followUnfollowUser, isPending } = useMutation({
    mutationFn: async ({
      userId,
      userName,
    }: {
      userId: string;
      userName: string;
    }) =>
      await api({
        endpoint: `/users/follow/${userId}`,
        method: HttpMethod.POST,
        successMessage: `@${userName} followed successfully`,
      }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['usersForRightPanel'] }),
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
      ]);
    },
  });
  return { followUnfollowUser, isPending };
};

export default useFollow;
