import { client } from '../clients/microcms';
import { config } from '../config/environment';
import { ListProps } from '../types/ListCMS';
import { FeatureFlagContent, FeatureFlags } from '../types/featureFlags';

export const getFeatureFlags = async (): Promise<FeatureFlags> => {
  if (config.environment === 'test' || config.environment === 'local')
    return { news: true, works: true, youtube: true };
  const data = await client.get<ListProps<FeatureFlagContent>>({
    endpoint: 'featureflags',
  });
  const result: FeatureFlags = {
    news: false,
    works: false,
    youtube: false,
  };
  data.contents.forEach((content) => {
    result[content.id] = content.isEnabled;
  });
  return result as FeatureFlags;
};
