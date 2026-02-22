import { Link } from 'react-router-dom';
import RightPanelSkeleton from '../skeletons/RightPanelSkeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api/api';
import { HttpMethod, type User } from '../../types';
import type { MouseEvent } from 'react';

const RightPanel = () => {
  const queryClient = useQueryClient();
  const { data: usersForRightPanel, isLoading } = useQuery<User[]>({
    queryKey: ['usersForRightPanel'],
    queryFn: () => api({ endpoint: '/users/suggested' }),
  });

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
      queryClient.invalidateQueries({ queryKey: ['usersForRightPanel'] });
    },
  });

  const handleFollowUnfollowUser = (
    event: MouseEvent,
    userId: string | undefined,
    userName: string | undefined
  ) => {
    event.preventDefault();
    if (userId && userName) followUnfollowUser({ userId, userName });
  };

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {(isLoading || isPending) && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!(isLoading || isPending) &&
            usersForRightPanel?.map((user) => (
              <Link
                to={`/profile/${user.userName}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={user.profileImage || '/avatar-placeholder.png'}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.userName}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) =>
                      handleFollowUnfollowUser(e, user?._id, user?.userName)
                    }
                  >
                    Follow
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
