import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: '1',
    slug: 'fintech-dashboard',
    title: 'FinTech Dashboard',
    description:
      'Real-time financial analytics platform processing over 2M transactions daily with sub-second latency.',
    thumbnail: '',
    tags: ['Web', 'DevOps'],
  },
  {
    id: '2',
    slug: 'health-tracker-app',
    title: 'Health Tracker',
    description:
      'Cross-platform mobile app for tracking vitals, medications, and appointments with HIPAA-compliant data storage.',
    thumbnail: '',
    tags: ['Mobile', 'Design'],
  },
  {
    id: '3',
    slug: 'ecommerce-redesign',
    title: 'E-Commerce Redesign',
    description:
      'Complete UX overhaul and rebranding for a marketplace serving 500K+ monthly active users.',
    thumbnail: '',
    tags: ['Design', 'Web'],
  },
  {
    id: '4',
    slug: 'cloud-migration',
    title: 'Cloud Migration',
    description:
      'Multi-cloud migration from on-premise to AWS/GCP with zero-downtime cutover and 40% cost reduction.',
    thumbnail: '',
    tags: ['DevOps'],
  },
  {
    id: '5',
    slug: 'fitness-app',
    title: 'FitNow Mobile App',
    description:
      'AI-powered fitness coaching app with workout plans, nutrition tracking, and social challenges.',
    thumbnail: '',
    tags: ['Mobile'],
  },
  {
    id: '6',
    slug: 'saas-portal',
    title: 'SaaS Admin Portal',
    description:
      'Enterprise admin portal with role-based access, audit logs, and custom reporting engine.',
    thumbnail: '',
    tags: ['Web', 'Design'],
  },
];

export const projectCategories = ['Web', 'Mobile', 'Design', 'DevOps'];
