import { CiImageOn } from 'react-icons/ci';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { useRef, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../../types';
import { api } from '../../utils/api/api';
import { successHandler } from '../../utils/handlers/successHandler';
import { errorHandler } from '../../utils/handlers/errorHandler';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData<User>(['authUser']);

  const {
    mutate: createPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (postData: { text: string; image: string }) =>
      api({ data: postData, endpoint: '/posts/create' }),
    onSuccess: () => {
      setText('');
      setImage('');
      successHandler('Post created successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => errorHandler(error),
  });

  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<string>('');

  const imgRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!text && !image) return toast.error('Please provide image or text');
    createPost({ text, image });
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImage || '/avatar-placeholder.png'} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {image && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImage('');
                if (imgRef.current) imgRef.current.value = '';
              }}
            />
            <img
              src={image}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current?.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};
export default CreatePost;
