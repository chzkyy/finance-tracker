import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface OAuthRedirectHandlerProps {
  children: React.ReactNode;
}

const OAuthRedirectHandler: React.FC<OAuthRedirectHandlerProps> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is an OAuth callback by looking for both code and state parameters
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log('OAuthRedirectHandler checking parameters:', {
      code: code ? `${code.substring(0, 20)}...` : null,
      state: state ? `${state.substring(0, 50)}...` : null,
      hasParameters: !!(code && state)
    });

    // If we have code and state parameters, this is likely an OAuth callback
    if (code && state) {
      console.log('OAuth callback detected, redirecting to callback handler');
      // Redirect to the OAuth callback handler with all parameters
      const callbackUrl = `/oauth/callback?${searchParams.toString()}`;
      navigate(callbackUrl, { replace: true });
    }
  }, [searchParams, navigate]);

  return <>{children}</>;
};

export default OAuthRedirectHandler;