import { flowSteps } from '../data/content';
import Section from './Section';

export function FlowSection() {
  return (
    <Section id="flow" title="相談の流れ">
      <ol className="flex flex-col">
        {flowSteps.map((step, index) => (
          <li
            key={step.title}
            className="flex gap-5 border-t border-neutral-200 py-6 first:border-t-0 first:pt-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.8] text-neutral-700">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 border-2 border-neutral-900 px-6 py-6">
        <p className="text-sm font-bold text-neutral-500">到達点</p>
        <p className="mt-2 text-lg font-bold leading-relaxed text-neutral-900 md:text-xl">
          最初の一台が、毎朝の実務で回り始める状態へ
        </p>
      </div>
    </Section>
  );
}

export default FlowSection;
