import Container from '../../../../components/parts/Container';
import Eyebrow from '../../../../components/parts/Eyebrow';
import {
  brandTokens,
  colorCssVar,
  fontCssVar,
  type BrandColorKey,
  type BrandFontKey,
} from '../../../../../brand/tokens';

const colorEntries = (Object.keys(brandTokens.color) as BrandColorKey[]).map(
  (key) => ({
    key,
    value: brandTokens.color[key],
    cssVar: colorCssVar[key],
  })
);

const fontEntries = (Object.keys(brandTokens.font) as BrandFontKey[]).map(
  (key) => ({
    key,
    value: brandTokens.font[key],
    cssVar: fontCssVar[key],
  })
);

export default function BrandTokens() {
  return (
    <section id="tokens" className="border-b border-brand-border">
      <Container className="py-20 md:py-28">
        <Eyebrow className="mb-6">{'// Tokens'}</Eyebrow>
        <h2 className="mb-10 font-brand-sans text-[clamp(28px,4vw,48px)] font-black leading-[1.05] tracking-[-0.025em] text-brand-fg">
          Colors and type.
        </h2>

        <div className="mb-12">
          <Eyebrow className="mb-5">Color</Eyebrow>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {colorEntries.map(({ key, value, cssVar }) => (
              <li
                key={key}
                className="flex flex-col gap-3 border border-brand-border p-5"
              >
                <span
                  aria-hidden="true"
                  className="block h-20 w-full rounded-[2px] border border-brand-border"
                  style={{ background: value }}
                />
                <div className="flex flex-col gap-1">
                  <code className="font-brand-mono text-[12px] tracking-[0.04em] text-brand-fg">
                    {key}
                  </code>
                  <code className="font-brand-mono text-[11px] tracking-[0.02em] text-brand-muted">
                    {value}
                  </code>
                  <code className="font-brand-mono text-[11px] tracking-[0.02em] text-brand-muted">
                    {`var(${cssVar})`}
                  </code>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow className="mb-5">Type</Eyebrow>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fontEntries.map(({ key, value, cssVar }) => (
              <li
                key={key}
                className="flex flex-col gap-4 border border-brand-border p-6"
              >
                <code className="font-brand-mono text-[11px] tracking-[0.04em] uppercase text-brand-muted">
                  {key}
                </code>
                <span
                  className="font-brand-sans text-[28px] font-bold tracking-[-0.02em] text-brand-fg"
                  style={{ fontFamily: value }}
                >
                  Twilight Blade.
                </span>
                <code className="font-brand-mono text-[11px] tracking-[0.02em] text-brand-muted">
                  {value}
                </code>
                <code className="font-brand-mono text-[11px] tracking-[0.02em] text-brand-muted">
                  {`var(${cssVar})`}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
