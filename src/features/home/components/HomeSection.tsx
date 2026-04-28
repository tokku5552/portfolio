import { ReactNode } from 'react';
import Container from '../../../components/parts/Container';
import Eyebrow from '../../../components/parts/Eyebrow';

interface HomeSectionProps {
  id: string;
  eyebrow: string;
  heading: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

export default function HomeSection({
  id,
  eyebrow,
  heading,
  description,
  children,
}: HomeSectionProps) {
  return (
    <section id={id} className="border-t border-brand-border">
      <Container className="py-20 md:py-28">
        <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
        <h2 className="mb-6 font-brand-sans text-[clamp(36px,5vw,64px)] font-black leading-[0.95] tracking-[-0.03em] text-brand-fg">
          {heading}
        </h2>
        {description ? (
          <div className="mb-10 max-w-[720px] font-brand-sans text-[clamp(15px,1.1vw,17px)] leading-[1.6] text-brand-muted">
            {description}
          </div>
        ) : null}
        <div>{children}</div>
      </Container>
    </section>
  );
}
