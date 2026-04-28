import Container from '../../../components/parts/Container';

interface StripCell {
  label: string;
  value: string;
}

const cells: StripCell[] = [
  { label: 'Currently', value: 'EM @ Mercari' },
  { label: 'Discography', value: 'INKDOSE · 2026—' },
  { label: 'Podcast', value: 'エンジニアがもがくラジオ' },
  { label: 'Stack', value: 'TypeScript · Go · Flutter' },
];

export default function HeroStrip() {
  return (
    <Container className="border-y border-brand-border">
      <ul className="grid grid-cols-2 md:grid-cols-4">
        {cells.map((cell, index) => (
          <li
            key={cell.label}
            className={
              'px-9 py-7 ' +
              (index < cells.length - 1
                ? 'border-r border-brand-border md:border-r '
                : '') +
              (index < 2 ? 'border-b border-brand-border md:border-b-0 ' : '')
            }
          >
            <div className="mb-2 font-brand-mono text-[11px] uppercase tracking-[0.08em] text-brand-muted">
              {cell.label}
            </div>
            <div className="font-brand-sans text-[15px] font-bold tracking-[-0.01em] text-brand-fg">
              {cell.value}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
