import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';

const UIKitVideoWithNoSSR = dynamic(
    () => import('../components/video/UIKitVideoPlayer'),
    { ssr: false }
);

const video = () => {
    return (
        <Layout title={'Video'}>
            <UIKitVideoWithNoSSR channel={'VideoChatApp'} />
        </Layout>
    );
};

export default video;
