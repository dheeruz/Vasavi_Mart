import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOTags = () => {
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = (path: string) => {
      const baseTitle = 'Vasavi Mart - Online Grocery & Daily Essentials';
      
      switch (path) {
        case '/':
          return baseTitle;
        case '/shop':
        case '/products':
          return `Shop Fresh Products | ${baseTitle}`;
        case '/cart':
          return `Your Shopping Cart | ${baseTitle}`;
        case '/checkout':
          return `Checkout | ${baseTitle}`;
        case '/login':
          return `Login | ${baseTitle}`;
        case '/signup':
          return `Sign Up | ${baseTitle}`;
        case '/account':
          return `My Account | ${baseTitle}`;
        case '/about':
          return `About Us | ${baseTitle}`;
        case '/contact':
          return `Contact Us | ${baseTitle}`;
        default:
          if (path.startsWith('/admin')) {
            return `Admin Dashboard | ${baseTitle}`;
          }
          return baseTitle;
      }
    };

    document.title = getPageTitle(location.pathname);
  }, [location]);

  return null;
};

export default SEOTags;
