import { env } from './env';
import { isAllowed } from '@core/robots';

export function hostAllowed(url: string): boolean {
  const host = new URL(url).host;
  return env.ALLOWED_SHOPS.includes(host);
}

export async function robotsAllowed(url: string): Promise<boolean> {
  return isAllowed(url);
}
