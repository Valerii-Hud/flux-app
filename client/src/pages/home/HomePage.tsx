import { useState } from 'react';

import Posts from '../../components/common/Posts.tsx';
import CreatePost from './CreatePost';
import type { FeedType } from '../../types/index.ts';

const HomePage = () => {
  const [feedType, setFeedType] = useState<FeedType>('all');

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        <header className="flex w-full border-b border-gray-700">
          <div
            className={
              'flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
            }
            onClick={() => setFeedType('all')}
          >
            For you
            {feedType === 'all' && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType('following')}
          >
            Following
            {feedType === 'following' && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </header>

        <CreatePost />

        <Posts feedType={feedType} />
      </div>
    </>
  );
};
export default HomePage;
