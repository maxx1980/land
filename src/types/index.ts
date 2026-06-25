import type { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface Section {
  id: string;
  component: ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  titleRu?: string;
  titleUk?: string;
  description: string;
  descriptionRu?: string;
  descriptionUk?: string;
  thumbnail?: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  text: string;
  textRu?: string;
  textUk?: string;
  photo?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
