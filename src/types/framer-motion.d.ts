declare module 'framer-motion' {
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const motion: {
    div: React.ForwardRefExoticComponent<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    g: React.ForwardRefExoticComponent<MotionProps & React.SVGAttributes<SVGGElement>>;
    circle: React.ForwardRefExoticComponent<MotionProps & React.SVGAttributes<SVGCircleElement>>;
  };

  export const AnimatePresence: React.FC<{
    children: React.ReactNode;
    [key: string]: any;
  }>;
}
