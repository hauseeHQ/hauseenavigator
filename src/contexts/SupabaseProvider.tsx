import { useEffect, ReactNode } from 'react';
import { useAuth, useSession } from '@clerk/clerk-react';
import { supabase } from '../lib/supabaseClient';

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const { session } = useSession();

  useEffect(() => {
    const setSupabaseToken = async () => {
      if (session) {
        const token = await getToken({ template: 'supabase' });

        if (token) {
          await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
        }
      } else {
        await supabase.auth.signOut();
      }
    };

    setSupabaseToken();
  }, [session, getToken]);

  return <>{children}</>;
}
