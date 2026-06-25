import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
  id?: string;
}

export function Container({
  children,
  className,
  as: Component = 'div',
  id,
}: ContainerProps) {
  return (
    <Component
      id={id}
      className={cn(
        'max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </Component>
  );
}
