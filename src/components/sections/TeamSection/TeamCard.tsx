import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { cn } from '@/utils';
import type { TeamMember } from '@/types';

interface TeamCardProps {
  member: TeamMember;
  /** Index for stagger delay */
  index?: number;
}

/**
 * Returns the initials from a full name string.
 * Example: "Alexei Volkov" => "AV", "Dmitry" => "D"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  if (parts.length > 1 && first !== last) {
    return (first + last).toUpperCase();
  }
  return first.toUpperCase() || '?';
}

/**
 * Returns a deterministic background color based on a string key.
 * Uses a set of harmonious colors.
 */
function getAvatarColor(key: string): string {
  const colors = [
    'bg-primary/15 text-primary',
    'bg-accent/15 text-accent',
    'bg-success/15 text-success',
    'bg-warning/15 text-warning',
    'bg-error/15 text-error',
    'bg-info/15 text-info',
  ];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Maps team member socialLinks to the SocialLinks component format.
 */
function mapSocialLinks(
  socialLinks: TeamMember['socialLinks'],
): Array<{ platform: 'github' | 'linkedin' | 'twitter'; url: string }> {
  if (!socialLinks) return [];

  const links: Array<{ platform: 'github' | 'linkedin' | 'twitter'; url: string }> = [];
  if (socialLinks.github) {
    links.push({ platform: 'github', url: socialLinks.github });
  }
  if (socialLinks.linkedin) {
    links.push({ platform: 'linkedin', url: socialLinks.linkedin });
  }
  if (socialLinks.twitter) {
    links.push({ platform: 'twitter', url: socialLinks.twitter });
  }
  return links;
}

export const TeamCard = ({ member, index = 0 }: TeamCardProps) => {
  const { t } = useTranslation();
  const resolvedName = t(member.name, member.name);
  const resolvedRole = t(member.role, member.role);
  const initials = getInitials(resolvedName);
  const [imageError, setImageError] = useState(false);

  const socialItems = mapSocialLinks(member.socialLinks);
  const hasPhoto = !!member.photo && !imageError;

  return (
    <motion.article
      role="article"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col items-center text-center p-6 md:p-7',
        'rounded-lg bg-surface border border-border',
        'shadow-md hover:shadow-lg',
        'transition-shadow duration-200',
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Avatar */}
      <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
        {hasPhoto ? (
          <img
            src={member.photo}
            alt={t('team.socialLabel', { name: resolvedName })}
            onError={() => setImageError(true)}
            className="w-full h-full rounded-full object-cover border-2 border-border"
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              'w-full h-full rounded-full flex items-center justify-center',
              'border-2 border-border',
              getAvatarColor(member.id),
            )}
            aria-hidden="true"
          >
            <span className="text-xl md:text-2xl font-bold select-none">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Name & Role */}
      <h3 className="text-lg font-bold text-text-primary">{resolvedName}</h3>
      <p className="text-sm text-text-secondary mt-1 mb-3">{resolvedRole}</p>

      {/* Social Links */}
      {socialItems.length > 0 && (
        <div className="mt-auto pt-2">
          <SocialLinks
            links={socialItems}
            size="sm"
            variant="light"
          />
        </div>
      )}
    </motion.article>
  );
};
