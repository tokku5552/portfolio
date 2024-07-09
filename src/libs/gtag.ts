import { config } from '../config/environment';

export const GA_MEASUREMENT_ID = config.gaID;

export const pageview = (url: string): void => {
  if (GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
