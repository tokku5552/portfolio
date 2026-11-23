import { problems } from '../data/content';
import Section from './Section';

export function ProblemsSection() {
  return (
    <Section id="problems" title="こんな悩み、ありませんか" band>
      <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
        {problems.map((problem) => (
          <li
            key={problem}
            className="flex gap-3 py-5 text-[15px] leading-[1.8] text-neutral-700 md:text-base"
          >
            <span
              aria-hidden="true"
              className="mt-[0.65em] h-2 w-2 shrink-0 bg-neutral-400"
            />
            <span>{problem}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-base leading-[1.9] text-neutral-700">
        こうした状態の原因は、たいていAIの性能ではなく、業務の側の分解が済んでいないことです。
      </p>
    </Section>
  );
}

export default ProblemsSection;
