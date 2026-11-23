import CtaButtons from './CtaButtons';

export function FinalCtaSection() {
  return (
    <section id="cta" className="bg-white">
      <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <h2 className="text-[26px] font-bold leading-snug tracking-tight text-neutral-900 md:text-[32px]">
          まずは1回、業務の切り分けから。
        </h2>
        <p className="mt-6 text-base leading-[1.9] text-neutral-700">
          大きな提案書の前に、動くものを1つ。御社の業務で最初に効く一手と、やらないほうがいいことを、持ち帰れる形でお渡しします。
        </p>
        <CtaButtons className="mt-8" />
      </div>
    </section>
  );
}

export default FinalCtaSection;
