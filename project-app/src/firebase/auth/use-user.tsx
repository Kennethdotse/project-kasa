'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { useAuth } from '../provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
      setUser(currentUser);
      if (!currentUser) {
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous sign-in failed', error);
        });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
