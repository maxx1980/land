import { cn } from '@/utils';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

const variantClasses: Record<NonNullable<SkeletonProps['variant']>, string> = {
  text: 'h-4 rounded w-full',
  circle: 'rounded-full',
  rect: 'rounded-md',
  card: 'h-48 rounded-lg',
};

export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const skeletonElements = items.map((i) => (
    <div
      key={i}
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-surface-alt',
        variantClasses[variant],
        className,
      )}
      style={{
        width,
        height,
      }}
    />
  ));

  if (count > 1) {
    return <div className="flex flex-col gap-2">{skeletonElements}</div>;
  }

  return <>{skeletonElements}</>;
}
