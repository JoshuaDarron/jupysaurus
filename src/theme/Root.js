import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ErrorBoundary from '@site/src/components/ErrorBoundary';

export default function Root({ children }) {
  return (
    <>
      {children}
      <BrowserOnly>
        {() => {
          const Chatbot = require('@site/src/components/Chatbot').default;
          return (
            <ErrorBoundary>
              <Chatbot />
            </ErrorBoundary>
          );
        }}
      </BrowserOnly>
    </>
  );
}
