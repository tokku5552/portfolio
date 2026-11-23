import CtaButtons from './CtaButtons';

export function ConsultingHero() {
  return (
    <section id="hero" className="bg-white">
      <div className="mx-auto max-w-3xl px-5 pb-14 pt-12 md:pb-20 md:pt-16">
        <h1 className="text-[30px] font-bold leading-[1.4] tracking-tight text-neutral-900 md:text-[40px] md:leading-[1.4]">
          議事録、週報、下調べ。
          <br />
          名前のついた面倒は、だいたい自動化できる。
        </h1>
        <p className="mt-6 text-base leading-[1.9] text-neutral-700 md:text-lg md:leading-[1.9]">
          AIエージェントを自分で作って、毎日の仕事を任せています。あなたの会社の業務でも同じことができないか、最初の相談で一緒に見ます。
        </p>
        <p className="mt-6 text-sm text-neutral-500">
          徳田真之介｜Engineering Manager / LINE API Expert
        </p>
        <CtaButtons className="mt-8" />
      </div>
      <div className="mx-auto max-w-5xl px-5 pb-14 md:pb-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/ai-consulting-hero.webp"
          alt="朝のオフィスで、コーヒーを飲む男性のまわりを小さなロボットたちが働くイラスト"
          width={2736}
          height={912}
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}

export default ConsultingHero;
