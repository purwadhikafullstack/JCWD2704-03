import { BASE_WEB_URL } from '@/configs/config';

export function generateVerificationUrl(
  verificationToken: string,
  action: 'verify' | 'reverify' | 'changePassword',
): string {
  return `${'https://jcwd270403.purwadhikabootcamp.com'}/${action}/${verificationToken}`;
}
