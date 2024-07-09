export interface FeatureFlags {
  news: boolean;
  works: boolean;
  youtube: boolean;
}

export interface FeatureFlagContent {
  id: keyof FeatureFlags;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  displayName: string;
  isEnabled: boolean;
  targetPercent: number;
}
