import { promises } from '../data/content';
import Section from './Section';

export function PromisesSection() {
  return (
    <Section id="promises" title="約束">
      <div className="grid gap-px border border-neutral-200 bg-neutral-200 md:grid-cols-2">
        {promises.map((promise) => (
          <div key={promise.title} className="bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-neutral-900">
              {promise.title}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.8] text-neutral-700">
              {promise.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default PromisesSection;
