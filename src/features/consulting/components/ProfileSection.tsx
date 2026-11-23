import { linedcUrl } from '@/config/constants';
import Section from './Section';

export function ProfileSection() {
  return (
    <Section id="profile" title="プロフィール" band>
      <p className="text-xl font-bold text-neutral-900">
        徳田真之介（とくだ しんのすけ）
      </p>
      <ul className="mt-6 flex flex-col gap-3 text-[15px] leading-[1.8] text-neutral-700 md:text-base">
        <li>Engineering Manager / LINE API Expert</li>
        <li>九州大学 理学部 物理学科 卒</li>
        <li>
          元インフラエンジニア。SIerでキャリアを始め、Web系企業数社を経て、インフラから開発組織のマネジメントまでを経験
        </li>
        <li>Podcast「エンジニアがもがくラジオ」ホスト</li>
      </ul>
      <p className="mt-6 text-[15px] leading-[1.8] text-neutral-700">
        LINE API
        Expert（LINEの開発者コミュニティにおける認定エキスパート）のプロフィールは
        <a
          href={linedcUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0a5a58] underline underline-offset-4 hover:opacity-80"
        >
          こちら
        </a>
        。
      </p>
    </Section>
  );
}

export default ProfileSection;
