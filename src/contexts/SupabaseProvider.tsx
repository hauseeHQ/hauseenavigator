import { ReactNode, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../lib/supabaseClient';

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { getToken, userId } = useAuth();

  useEffect(() => {
    const setSupabaseAuth = async () => {
      if (userId) {
        const token = await getToken({ template: 'supabase' });
        if (token) {
          supabase.realtime.setAuth(token);
        }
      }
    };

    setSupabaseAuth();
  }, [getToken, userId]);

  return <>{children}</>;
}
