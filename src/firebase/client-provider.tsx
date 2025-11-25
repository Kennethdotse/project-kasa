'use client';

import { useEffect, useState } from 'react';
import { getFirebase } from '.';

// This ensures that Firebase is only initialized once on the client
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    getFirebase();
    setInitialized(true);
  }, []);

  if (!initialized) {
    return null;
  }

  return <>{children}</>;
}
