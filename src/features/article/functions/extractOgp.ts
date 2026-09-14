export type OgpData = {
  [key: string]: string;
};

export const extractOgp = (metaElements: HTMLMetaElement[]): OgpData => {
  return metaElements
    .filter((element) => element.hasAttribute('property'))
    .reduce<OgpData>((previous, current) => {
      const property = current.getAttribute('property')?.trim();
      const content = current.getAttribute('content');
      // Skip entries without content so callers' `??` fallbacks still apply.
      if (!property || content === null) return previous;
      previous[property] = content;
      return previous;
    }, {});
};
