import type { AppProps } from 'next/app';
import '../styles/globals.css';

// Loading component that matches SSR and client
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying authentication...</p>
    </div>
  </div>
);

// Client-only authentication wrapper
function ClientAuthWrapper({ Component, pageProps }: AppProps) {
  // Only import React hooks on client side
  if (typeof window === 'undefined') {
    // SSR: Return loading state that matches client initial render
    return <LoadingState />;
  }

  // Client-side: Use dynamic import to avoid SSR issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react') as typeof import('react');
  const { useEffect, useState } = React;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            query: `
              query Me {
                me {
                  id
                  email
                  firstName
                  lastName
                }
              }
            `,
          }),
        });

        const result = await response.json();

        if (result.data?.me) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setIsRedirecting(true);
          // Clear localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('user_data');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');
          localStorage.removeItem('auth_expires_at');
          // Redirect immediately
          window.location.href = "http://localhost:3005";
        }
      } catch (error) {
        // Silently handle error and redirect
        setIsAuthenticated(false);
        setIsRedirecting(true);
        localStorage.removeItem('user');
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_expires_at');
        // Redirect immediately
        window.location.href = "http://localhost:3005";
      }
    };

    checkAuth();
  }, [isMounted]);

  // Show loading state while checking authentication or redirecting
  if (!isMounted || isAuthenticated === null || isRedirecting) {
    return <LoadingState />;
  }

  // Only render if authenticated
  if (isAuthenticated) {
    return <Component {...pageProps} />;
  }

  // If not authenticated, show loading (redirect is happening)
  return <LoadingState />;
}

export default function App(props: AppProps) {
  return <ClientAuthWrapper {...props} />;
}

