import { faqs } from '../data/content';
import Section from './Section';

export function FaqSection() {
  return (
    <Section id="faq" title="よくある質問" band>
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-6">
            <h3 className="text-base font-bold text-neutral-900 md:text-lg">
              {faq.question}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.9] text-neutral-700">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default FaqSection;
