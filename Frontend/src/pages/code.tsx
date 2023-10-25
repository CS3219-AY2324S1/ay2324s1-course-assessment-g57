import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const MonacoEditorComponentWithNoSSR = dynamic(
  () => import('../components/editor/Editor'),
  { ssr: false }
);

type CodeEditorPageProps = {
  user?: any;
  isLoading: boolean;
};

const CodeEditorPage = ({ user, isLoading }: CodeEditorPageProps) => {
  return (
    <Layout title={'Collaborate'} user={user} loading={isLoading}>
      <MonacoEditorComponentWithNoSSR />
    </Layout>
  );
};

export default withPageAuthRequired(CodeEditorPage);
