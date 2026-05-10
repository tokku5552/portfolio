import { ConstructorOptions, JSDOM, VirtualConsole } from 'jsdom';

/**
 * JSDOM を生成する共通ヘルパ。
 *
 * 外部ページの `<style>` ブロックに jsdom の CSS パーサが対応しない構文
 * (`color-mix()`, `@layer`, `@container` など) が含まれていると、
 * jsdom が `virtualConsole` 経由で `Could not parse CSS stylesheet` を発火し
 * デフォルトでは stderr を汚染する。機能には影響しないため、その jsdomError のみ
 * 捨て、他の jsdomError は引き続き従来通り stderr に流す。
 */
export const createDom = (
  html: string,
  options?: ConstructorOptions
): JSDOM => {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (err) => {
    if (err.message !== 'Could not parse CSS stylesheet') {
      console.error(err);
    }
  });
  return new JSDOM(html, { ...options, virtualConsole });
};
