import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import { useQuery } from '@tanstack/react-query';
import {
  HttpMethod,
  type Endpoint,
  type FeedType,
  type PostType,
} from '../../types';
import { useEffect } from 'react';
import { api } from '../../utils/api/api';

interface PostsProps {
  feedType: FeedType;
  userName: string | undefined;
  userId: string;
}

const Posts = ({ feedType, userName, userId }: PostsProps) => {
  const getPostEndpoint = () => {
    const ALL_POSTS = '/posts/all';
    const FOLLOWING_POSTS = '/posts/following';
    switch (feedType) {
      case 'all':
        return ALL_POSTS;
      case 'following':
        return FOLLOWING_POSTS;
      case 'posts':
        if (!userName) throw new Error('User Not Found');
        return `/posts/user/${userName}` as Endpoint;
      case 'likes':
        if (!userName) throw new Error('User Not Found');
        return `/posts/likes/${userId}` as Endpoint;
      default:
        return ALL_POSTS;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch: refetchPosts,
    isRefetching,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => api({ endpoint: POST_ENDPOINT, method: HttpMethod.GET }),
  });

  useEffect(() => {
    refetchPosts();
  }, [feedType, refetchPosts, userName]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post: PostType) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
