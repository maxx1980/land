/**
 * Application-wide constants: navigation, social links, contact and company info.
 */

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const navItems: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/#portfolio' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
] as const;

/* ------------------------------------------------------------------ */
/*  Social links                                                       */
/* ------------------------------------------------------------------ */

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export const socialLinks: readonly SocialLink[] = [
  { platform: 'github', url: 'https://github.com/devfirm', label: 'GitHub' },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/company/devfirm',
    label: 'LinkedIn',
  },
  { platform: 'twitter', url: 'https://twitter.com/devfirm', label: 'Twitter' },
  { platform: 'telegram', url: 'https://t.me/devfirm', label: 'Telegram' },
] as const;

/* ------------------------------------------------------------------ */
/*  Contact info                                                       */
/* ------------------------------------------------------------------ */

export interface ContactInfo {
  email: string;
  phone: string;
  phoneRaw: string;
  address: string;
  workingHours: string;
}

export const contactInfo: ContactInfo = {
  email: 'hello@devfirm.com',
  phone: '+1 (555) 123-4567',
  phoneRaw: '+15551234567',
  address: '123 Market St, San Francisco, CA',
  workingHours: 'Mon–Fri: 9:00 – 18:00',
};

/* ------------------------------------------------------------------ */
/*  Company info                                                       */
/* ------------------------------------------------------------------ */

export interface CompanyInfo {
  name: string;
  /** The full legal name (used in privacy policy, etc.). */
  legalName: string;
  foundingYear: number;
}

export const companyInfo: CompanyInfo = {
  name: 'DevFirm',
  legalName: 'DevFirm Inc.',
  foundingYear: 2015,
};
