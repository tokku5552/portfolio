import Seo from '@/components/layouts/Seo';
import { baseURL } from '../config/constants';
import Consulting from '../features/service/Consulting.page';

export default function ConsultingPage() {
  return (
    <>
      <Seo
        pageTitle="AI導入・エージェント活用相談"
        pageDescription="AIツールを試したけど、現場の業務に落とし込めていない事業責任者・マネージャーの方へ。AIエージェントを自分で作って毎日の実務で運用しているエンジニアリングマネージャーが、御社の業務の切り分けと、最初に作るべきエージェントの設計を一緒に考えます。"
        pagePath={`${baseURL}/consulting`}
      />
      <Consulting />
    </>
  );
}

// Standalone LP: rendered without BaseLayout (see src/pages/_app.tsx).
ConsultingPage.standalone = true;
