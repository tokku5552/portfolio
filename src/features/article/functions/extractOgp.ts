export type OgpData = {
  [key: string]: string;
};

export const extractOgp = (metaElements: HTMLMetaElement[]): OgpData => {
  const ogp = metaElements
    .filter((element: Element) => element.hasAttribute("property"))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .reduce((previous: any, current: Element) => {
      const property = current.getAttribute("property")?.trim();
      if (!property) return;
      const content = current.getAttribute("content");
      previous[property] = content;
      return previous;
    }, {});

  return ogp;
};
