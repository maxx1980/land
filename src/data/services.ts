import type { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'web-development',
    icon: '🌐',
    title: 'services.web.title',
    description: 'services.web.description',
    features: [
      'services.web.features.custom',
      'services.web.features.react',
      'services.web.features.seo',
      'services.web.features.performance',
    ],
  },
  {
    id: 'mobile-apps',
    icon: '📱',
    title: 'services.mobile.title',
    description: 'services.mobile.description',
    features: [
      'services.mobile.features.crossplatform',
      'services.mobile.features.native',
      'services.mobile.features.push',
      'services.mobile.features.offline',
    ],
  },
  {
    id: 'ui-ux-design',
    icon: '🎨',
    title: 'services.uiux.title',
    description: 'services.uiux.description',
    features: [
      'services.uiux.features.research',
      'services.uiux.features.prototype',
      'services.uiux.features.designsystem',
      'services.uiux.features.testing',
    ],
  },
  {
    id: 'devops',
    icon: '⚙️',
    title: 'services.devops.title',
    description: 'services.devops.description',
    features: [
      'services.devops.features.cicd',
      'services.devops.features.cloud',
      'services.devops.features.monitoring',
      'services.devops.features.automation',
    ],
  },
  {
    id: 'it-consulting',
    icon: '💡',
    title: 'services.consulting.title',
    description: 'services.consulting.description',
    features: [
      'services.consulting.features.audit',
      'services.consulting.features.strategy',
      'services.consulting.features.architecture',
      'services.consulting.features.optimization',
    ],
  },
  {
    id: 'support',
    icon: '🔧',
    title: 'services.support.title',
    description: 'services.support.description',
    features: [
      'services.support.features.monitoring247',
      'services.support.features.bugfix',
      'services.support.features.updates',
      'services.support.features.sla',
    ],
  },
];
