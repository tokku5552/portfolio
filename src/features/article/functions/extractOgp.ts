export type OgpData = {
  [key: string]: string;
};

export const extractOgp = (metaElements: HTMLMetaElement[]): OgpData => {
  const ogp = metaElements
    .filter((element: Element) => element.hasAttribute('property'))
    .reduce((previous: any, current: Element) => {
      const property = current.getAttribute('property')?.trim();
      if (!property) return;
      const content = current.getAttribute('content');
      previous[property] = content;
      return previous;
    }, {});

  return ogp;
};
