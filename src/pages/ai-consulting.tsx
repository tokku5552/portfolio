import Head from 'next/head';
import Seo from '@/components/layouts/Seo';
import { baseURL } from '../config/constants';
import Consulting from '../features/consulting/Consulting.page';

export default function AiConsultingPage() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Seo
        pageTitle="AI導入・エージェント活用相談"
        pageDescription="AIツールを試したけど、現場の業務に落とし込めていない事業責任者・マネージャーの方へ。AIエージェントを自分で作って毎日の実務で運用しているエンジニアリングマネージャーが、御社の業務の切り分けと、最初に作るべきエージェントの設計を一緒に考えます。"
        pagePath={`${baseURL}/ai-consulting`}
      />
      <Consulting />
    </>
  );
}
