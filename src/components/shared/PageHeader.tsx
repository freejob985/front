import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
  className?: string;
}

const PageHeader = ({ 
  title, 
  subtitle, 
  description, 
  action, 
  className = "" 
}: PageHeaderProps) => {
  return (
    <div className={`bg-gradient-to-r from-primary/5 to-primary/10 py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          {subtitle && (
            <p className="text-primary font-medium mb-2">{subtitle}</p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
          )}
          {action && (
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {action.label}
              {action.icon || <ArrowRight className="h-5 w-5 mr-2" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
