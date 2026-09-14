import { buttonClasses } from '../../components/parts/Button';
import Container from '../../components/parts/Container';
import Eyebrow from '../../components/parts/Eyebrow';
import Link from '../../components/parts/Link';
import Orb from '../../components/parts/Orb';

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <Orb position="tr" />
      <span aria-hidden="true" className="tb-grain" />

      <Container className="relative z-[2] py-24 md:py-32">
        <Eyebrow className="mb-10">404 · Not found</Eyebrow>

        <h1 className="mb-7 font-brand-sans text-[clamp(48px,11vw,140px)] font-black leading-[0.88] tracking-[-0.045em] text-brand-fg">
          Lost
          <span className="tb-period-gradient">.</span>
        </h1>

        <p className="mb-14 max-w-[640px] font-brand-sans text-[clamp(16px,1.25vw,18px)] leading-[1.55] text-brand-muted">
          お探しのページは見つかりませんでした。URL
          が変わったか、削除された可能性があります。
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className={buttonClasses('primary')}>
            <span>Back to home</span>
          </Link>
          <Link href="/articles" className={buttonClasses('ghost')}>
            <span>Browse articles</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
