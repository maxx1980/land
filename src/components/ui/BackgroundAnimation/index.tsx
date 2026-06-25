import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface BackgroundAnimationProps {
  variant?: 'gradient' | 'particles' | 'none';
  className?: string;
  children?: ReactNode;
}

export function BackgroundAnimation({
  variant = 'gradient',
  className,
  children,
}: BackgroundAnimationProps) {
  if (variant === 'none') return null;

  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden', className)}>
      {children}
      {variant === 'gradient' && (
        <>
          <motion.div
            className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] rounded-full blur-3xl motion-reduce:animate-none"
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)',
            }}
            animate={{
              x: ['0%', '10%', '-5%', '0%'],
              y: ['0%', '-5%', '10%', '0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute -bottom-1/2 -right-1/4 w-[150%] h-[150%] rounded-full blur-3xl motion-reduce:animate-none"
            style={{
              background:
                'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
            }}
            animate={{
              x: ['0%', '-8%', '5%', '0%'],
              y: ['0%', '8%', '-4%', '0%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </>
      )}

      {variant === 'particles' && (
        <div className="absolute inset-0" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => {
            const left = (i * 37 + 11) % 100;
            const top = (i * 53 + 7) % 100;
            const size = ((i * 7 + 3) % 4) + 2;
            const opacity = 0.15 + ((i * 13) % 10) * 0.03;

            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-primary"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                  opacity,
                }}
                animate={{
                  y: ['0px', '-20px', '0px'],
                  opacity: [opacity, opacity * 0.3, opacity],
                }}
                transition={{
                  duration: 3 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
