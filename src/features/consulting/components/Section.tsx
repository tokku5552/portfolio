import { ReactNode } from 'react';
import { cn } from '@/libs/cn';

interface SectionProps {
  id: string;
  title: string;
  band?: boolean;
  wide?: boolean;
  children: ReactNode;
}

export function Section({ id, title, band, wide, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('py-14 md:py-20', band ? 'bg-neutral-50' : 'bg-white')}
    >
      <div className={cn('mx-auto px-5', wide ? 'max-w-5xl' : 'max-w-3xl')}>
        <h2 className="text-[26px] font-bold leading-snug tracking-tight text-neutral-900 md:text-[32px]">
          {title}
        </h2>
        <div className="mt-8 md:mt-10">{children}</div>
      </div>
    </section>
  );
}

export default Section;
