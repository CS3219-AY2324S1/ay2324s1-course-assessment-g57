import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';

const MonacoEditorComponentWithNoSSR = dynamic(
  () => import('../components/editor/Editor'),
  { ssr: false }
);

const CodeEditorPage = () => {
  return (
    <Layout title={'Collaborate'}>
      <MonacoEditorComponentWithNoSSR />
    </Layout>
  );
};

export default CodeEditorPage;
