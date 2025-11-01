import React from 'react';

export const EnvCheck: React.FC = () => {
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
    VITE_GOOGLE_AI_API_KEY: import.meta.env.VITE_GOOGLE_AI_API_KEY ? 'Set' : 'Missing',
  };

  // Only show in development or if there are missing vars
  const hasMissing = Object.values(envVars).includes('Missing');
  if (import.meta.env.PROD && !hasMissing) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-900 border border-yellow-600 text-yellow-200 p-3 rounded-lg text-xs z-50">
      <div className="font-bold mb-1">Environment Check:</div>
      {Object.entries(envVars).map(([key, status]) => (
        <div key={key} className={status === 'Missing' ? 'text-red-300' : 'text-green-300'}>
          {key}: {status}
        </div>
      ))}
    </div>
  );
};