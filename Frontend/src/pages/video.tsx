import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const UIKitVideoWithNoSSR = dynamic(
  () => import('../components/video/UIKitVideoPlayer'),
  { ssr: false }
);

type VideoPageProps = {
  user?: any;
  isLoading: boolean;
};

const VideoPage = ({ user, isLoading }: VideoPageProps) => {
  return (
    <Layout title={'Video'} user={user} loading={isLoading}>
      <UIKitVideoWithNoSSR channel={'VideoChatApp'} />
    </Layout>
  );
};

export default withPageAuthRequired(VideoPage);
