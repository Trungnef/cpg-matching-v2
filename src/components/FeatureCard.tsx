
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  className
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "glass p-6 rounded-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg motion-item card-3d",
        className
      )}
    >
      <div className="mb-4 text-primary h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 card-3d-content">{title}</h3>
      <p className="text-foreground/70 card-3d-content">{description}</p>
    </div>
  );
};

export default FeatureCard;
