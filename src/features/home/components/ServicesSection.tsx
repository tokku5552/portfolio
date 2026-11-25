import TimeTicketConsultation from '../../service/Service';
import HomeSection from './HomeSection';

export default function ServicesSection() {
  return (
    <HomeSection
      id="services"
      eyebrow="// Services"
      heading="Work with me"
      description="現場の AI 導入や、エンジニアリング組織の立ち上げ・改善まわりの相談を受けています。"
    >
      <TimeTicketConsultation />
    </HomeSection>
  );
}
