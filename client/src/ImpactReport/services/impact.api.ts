import { getData } from '../../util/api';

export interface HeroApiResponse<T> {
  data: T;
}

export interface HeroCta {
  label?: string;
  href?: string;
}

export interface HeroContent {
  backgroundColor?: string;
  backgroundImage?: string | null;
  title?: string;
  subtitle?: string;
  year?: string;
  tagline?: string;
  bubbles?: string[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

export async function fetchHeroContent(): Promise<HeroContent | null> {
  const res = await getData('impact/hero');
  if (res.error) return null;
  const payload = res.data as HeroApiResponse<HeroContent>;
  return payload?.data ?? null;
}

