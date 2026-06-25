import type { ReactNode, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  hoverable = true,
  padding = 'md',
  onClick,
}: CardProps) {
  const isInteractive = !!onClick;

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }

  return (
    <motion.div
      role={isInteractive ? 'button' : 'article'}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      whileHover={
        hoverable
          ? { y: -2, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 10px -6px rgba(0,0,0,0.04)' }
          : undefined
      }
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-surface rounded-lg border border-border',
        paddingStyles[padding],
        hoverable && 'transition-shadow',
        hoverable && !isInteractive && 'shadow-md hover:shadow-lg',
        isInteractive && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
