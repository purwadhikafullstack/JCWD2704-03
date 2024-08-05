'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/libs/supabase';
import { axiosInstance } from '@/libs/axios.config';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const hash = window.location.hash;

      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const userType = new URLSearchParams(window.location.search).get(
          'userType',
        );

        if (accessToken && refreshToken) {
          try {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error('Error setting session:', sessionError.message);
              return;
            }

            const { data: userResponse, error: userError } =
              await supabase.auth.getUser();

            if (userError) {
              console.error('Error fetching user:', userError.message);
              return;
            }

            if (userResponse) {
              const { user } = userResponse;
              const { email, id, user_metadata } = user;
              const { full_name } = user_metadata || {};
              const [first_name, last_name] = full_name
                ? full_name.split(' ')
                : ['', ''];

              try {
                if (userType === 'user') {
                  await axiosInstance().post('/api/users/v4', {
                    email,
                    social_id: id,
                    first_name,
                    last_name,
                    role: 'user',
                  });
                  window.location.reload();
                } else if (userType === 'tenant') {
                  await axiosInstance().post('/api/users/v5', {
                    email,
                    social_id: id,
                    first_name,
                    last_name,
                    role: 'tenant',
                  });
                  window.location.reload();
                }
              } catch (error) {
                console.error('Error logging in with Google:', error);
              }
            }
          } catch (error) {
            console.error('Error processing OAuth callback:', error);
          }
        } else {
          console.error('Access token or refresh token missing.');
        }
      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <Spinner animation="border" role="status" className="me-2"></Spinner>
      <div className="text-center p-4">
        <span className="visually-hidden">Loading...</span>

        <p className="mt-2 font-semibold">
          You are being authorized and will be redirected shortly...
        </p>
      </div>
    </div>
  );
};

export default Callback;
