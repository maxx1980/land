import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { validateName, validateEmail, validateMessage } from './validation';
export {
  navItems,
  socialLinks,
  contactInfo,
  companyInfo,
} from './constants';
export type { NavItem, SocialLink, ContactInfo, CompanyInfo } from './constants';
export { formatPhone, formatDate, formatDateShort } from './formatters';
