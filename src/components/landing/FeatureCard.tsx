import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
}) => {
  return (
    <div className={cn("feature-card group", className)}>
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
        "bg-gradient-to-br from-primary/10 to-ice-deep/10",
        "group-hover:from-primary/20 group-hover:to-ice-deep/20 transition-colors",
        iconClassName
      )}>
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};
