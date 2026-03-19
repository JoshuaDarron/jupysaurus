import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ErrorBoundary from '@site/src/components/ErrorBoundary';

export default function SearchBarWrapper() {
  return (
    <BrowserOnly>
      {() => {
        const SearchBar = require('./SearchBar').default;
        return (
          <ErrorBoundary>
            <SearchBar />
          </ErrorBoundary>
        );
      }}
    </BrowserOnly>
  );
}
