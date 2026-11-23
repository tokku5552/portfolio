import { deliverables } from '../data/content';
import Section from './Section';

export function DeliverablesSection() {
  return (
    <Section id="deliverables" title="相談で得られるもの" band>
      <p className="text-base leading-[1.9] text-neutral-700">
        相談のゴールは「何でもAIでできますね」という話ではなく、稟議や現場への説明に使える形で持ち帰ることです。
      </p>
      <div className="mt-10 flex flex-col gap-10">
        {deliverables.map((item, index) => (
          <div key={item.title} className="border-t-2 border-neutral-900 pt-5">
            <p className="text-sm font-bold text-neutral-500">
              成果物 {index + 1}
            </p>
            <h3 className="mt-2 text-xl font-bold text-neutral-900">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.9] text-neutral-700 md:text-base">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default DeliverablesSection;
