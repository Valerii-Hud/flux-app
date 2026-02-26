import { FaRegComment } from 'react-icons/fa';
import { BiRepost } from 'react-icons/bi';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { HttpMethod, type PostType, type User } from '../../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api/api';
import LoadingSpinner from './LoadingSpinner';

const Post = ({ post }: { post: PostType }) => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery<User>({ queryKey: ['authUser'] });

  const { mutate: deletePost, isPending: isPendingDeletePost } = useMutation({
    mutationFn: (postId: string) =>
      api({
        endpoint: `/posts/${postId}`,
        method: HttpMethod.DELETE,
        successMessage: 'Post deleted successfully',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });

  const { mutate: likePost, isPending: isPendingLikePost } = useMutation({
    mutationFn: (postId: string) =>
      api({
        endpoint: `/posts/like/${postId}`,
        method: HttpMethod.POST,
      }),

    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(['posts'], (oldPosts: PostType[]) => {
        if (!oldPosts) return [];

        return oldPosts.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        );
      });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });

  const { mutate: commentPost, isPending: isPendingCommentPost } = useMutation({
    mutationFn: (postId: string) =>
      api({
        endpoint: `/posts/comment/${postId}`,
        method: HttpMethod.POST,
        data: {
          text: comment,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });

  const [comment, setComment] = useState('');
  const postOwner = post.user;
  const isLiked = authUser?.likedPosts?.some(
    (id) => id.toString() === post._id?.toString()
  );
  const isMyPost = authUser?._id === post.user?._id;

  const formattedDate = '1h';

  const handleDeletePost = () => {
    if (typeof post._id === 'string') deletePost(post._id);
  };

  const handlePostComment = (
    e: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    e.preventDefault();
    if (post._id) commentPost(post._id);
  };

  const handleLikePost = () => {
    if (typeof post._id === 'string') likePost(post._id);
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner?.userName}`}
            className="w-8 rounded-full overflow-hidden"
          >
            <img src={postOwner?.profileImage || '/avatar-placeholder.png'} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner?.userName}`} className="font-bold">
              {postOwner?.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner?.userName}`}>
                @{postOwner?.userName}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {isPendingDeletePost ? (
                  <LoadingSpinner />
                ) : (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.image && (
              <img
                src={post.image}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() => {
                  const dialog = document.getElementById(
                    'comments_modal' + post._id
                  );

                  if (dialog instanceof HTMLDialogElement) {
                    dialog?.showModal();
                  }
                }}
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments?.length}
                </span>
              </div>
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {!isPendingCommentPost && post.comments?.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {!isPendingCommentPost &&
                      post.comments &&
                      post.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="flex gap-2 items-start"
                        >
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <img
                                src={
                                  comment.user?.profileImage ||
                                  '/avatar-placeholder.png'
                                }
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="font-bold">
                                {comment.user?.fullName}
                              </span>
                              <span className="text-gray-700 text-sm">
                                @{comment.user?.userName}
                              </span>
                            </div>
                            <div className="text-sm">{comment.text}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isPendingCommentPost ? (
                        <span className="loading loading-spinner loading-md"></span>
                      ) : (
                        'Post'
                      )}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isPendingLikePost && <LoadingSpinner size="sm" />}
                {!isLiked && !isPendingLikePost && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLiked && !isPendingLikePost && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
                )}

                <span
                  className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                    isLiked ? 'text-pink-500' : ''
                  }`}
                >
                  {isPendingLikePost ? '' : post.likes?.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
