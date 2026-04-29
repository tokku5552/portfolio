import Seo from '@/components/layouts/Seo';
import { baseURL } from '../config/constants';
import Brand from '../features/brand/Brand.page';

export default function BrandPage() {
  return (
    <>
      <Seo
        pageTitle="Brand · Twilight Blade"
        pageDescription="Twilight Blade — the design system behind tokku-tech.dev. Tokens, philosophy, and downloadable assets for AI agents and humans."
        pagePath={`${baseURL}/brand`}
        pageImg={`${baseURL}/brand-og.png`}
        pageImgWidth={1200}
        pageImgHeight={630}
      />
      <Brand />
    </>
  );
}
