
'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface Props {
  spec: Record<string, any>;
}

export default function ReactSwagger({ spec }: Props) {
  // Suppress specific console error from swagger-ui-react
  if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('UNSAFE_componentWillReceiveProps')) {
        return;
      }
      originalConsoleError(...args);
    };
  }
  
  return <SwaggerUI spec={spec} />;
}
