import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="animate-fade-in" style={{ animationDuration: '0.4s' }}>
      {children}
    </div>
  );
};

export default PageWrapper;
