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
  ...props
}) => {
  return (
    <div 
      className={cn(
        "p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50",
        "hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-default",
        className
      )}
      {...props}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
        "bg-primary/10",
        iconClassName
      )}>
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 tracking-[-0.01em]">{title}</h3>
      <p className="text-sm text-muted-foreground leading-loose">{description}</p>
    </div>
  );
};
