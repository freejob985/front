import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '../ErrorBoundary';
import CustomCSS from '../CustomCSS';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const Layout = ({ 
  children, 
  showHeader = true, 
  showFooter = true, 
  className = "" 
}: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <CustomCSS type="frontend" />
      {showHeader && <Header />}
      <main className="flex-1">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
