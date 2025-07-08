'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error component that displays when an uncaught error occurs in the app.
 * Provides a user-friendly error message and option to try again.
 */
export default function Error({ error, reset }: ErrorProps) {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  // Ensure translations are ready to avoid hydration mismatch
  const isTranslationReady = i18n.isInitialized && i18n.hasLoadedNamespace('common');

  // Helper function to get translated text with fallback
  const getTranslation = (key: string, fallback: string): string => {
    if (!isTranslationReady || !isClient) {
      return fallback;
    }
    const translated = t(key);
    // If translation returns the key itself, use fallback
    return translated === key ? fallback : translated;
  };

  return (
    <>
    <Header/>
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 md:px-6">
      <div className="flex flex-col items-center max-w-md text-center gap-6">
        <AlertCircle className="h-16 w-16 text-destructive" />
        
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {getTranslation('error.somethingWentWrong', 'Something went wrong')}
          </h1>
          <p className="text-muted-foreground mb-6">
            {getTranslation('error.unexpectedHappened', 'We\'re sorry, but something unexpected happened.')}
          </p>
        </div>

        <Alert variant="destructive" className="w-full">
          {error.message || getTranslation('error.unexpectedError', 'An unexpected error occurred')}
        </Alert>

        <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center">
          <Button 
            variant="default" 
            onClick={reset}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> {getTranslation('error.tryAgain', 'Try Again')}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            {getTranslation('error.returnHome', 'Return to Home')}
          </Button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
