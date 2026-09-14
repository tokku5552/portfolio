import Seo from '@/components/layouts/Seo';
import NotFound from '../features/error/NotFound.page';

export default function NotFoundPage() {
  return (
    <>
      <Seo pageTitle="404 Not Found" />
      <NotFound />
    </>
  );
}
