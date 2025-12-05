import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSignUp, useSignIn } from '@clerk/clerk-react';
import { Mail, Loader2, Home } from 'lucide-react';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const { signIn, setActive } = useSignIn();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(900);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const email = location.state?.email || 'your email';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMagicLinkCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const status = searchParams.get('__clerk_status');

      if (status === 'verified' || status === 'expired') {
        setIsProcessing(true);
        setProcessingMessage('Completing verification...');

        try {
          if (signUp) {
            await signUp.reload();

            if (signUp.status === 'complete') {
              if (setSignUpActive) {
                await setSignUpActive({ session: signUp.createdSessionId });
              }
              navigate('/plan');
              return;
            }
          }

          if (signIn) {
            await signIn.reload();

            if (signIn.status === 'complete') {
              if (setActive) {
                await setActive({ session: signIn.createdSessionId });
              }
              navigate('/plan');
              return;
            }
          }

          if (status === 'expired') {
            setResendMessage('The verification link has expired. Please request a new one.');
          }
        } catch (err) {
          console.error('Verification error:', err);
          setResendMessage('Verification failed. Please try again.');
        } finally {
          setIsProcessing(false);
          setProcessingMessage('');
        }
      }
    };

    handleMagicLinkCallback();
  }, [location.search, signUp, signIn, navigate, setActive, setSignUpActive]);

  useEffect(() => {
    if (isProcessing) return;

    const checkVerification = async () => {
      try {
        if (signUp) {
          await signUp.reload();
          if (signUp.status === 'complete') {
            if (setSignUpActive) {
              await setSignUpActive({ session: signUp.createdSessionId });
            }
            navigate('/plan');
            return;
          }
        }

        if (signIn) {
          await signIn.reload();
          if (signIn.status === 'complete') {
            if (setActive) {
              await setActive({ session: signIn.createdSessionId });
            }
            navigate('/plan');
            return;
          }
        }
      } catch (err) {
        console.error('Check verification error:', err);
      }
    };

    const interval = setInterval(checkVerification, 2000);
    return () => clearInterval(interval);
  }, [signUp, signIn, navigate, setActive, setSignUpActive, isProcessing]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      const redirectUrl = `${window.location.origin}/verify-email`;

      if (signUp) {
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_link',
          redirectUrl: redirectUrl
        });
        setResendMessage('Verification link sent! Check your email.');
        setTimeRemaining(900);
      } else if (signIn) {
        const factor = signIn.supportedFirstFactors.find(
          (f: any) => f.strategy === 'email_link'
        ) as any;

        if (factor?.emailAddressId) {
          await signIn.prepareFirstFactor({
            strategy: 'email_link',
            emailAddressId: factor.emailAddressId,
            redirectUrl: redirectUrl
          });
          setResendMessage('Magic link sent! Check your email.');
          setTimeRemaining(900);
        }
      }
    } catch (err: any) {
      console.error('Resend error:', err);
      setResendMessage('Failed to resend. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Home className="w-10 h-10 text-primary-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Verify Your Email
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-primary-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Check your email!
            </h3>

            <p className="text-gray-600 mb-4">
              We've sent a verification link to
            </p>
            <p className="text-primary-400 font-medium mb-6">{email}</p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 w-full">
              <p className="text-sm text-gray-700 mb-2">
                Click the link in your email to continue to Hausee Navigator.
              </p>
              <p className="text-xs text-gray-500">
                The link expires in {formatTime(timeRemaining)}
              </p>
            </div>

            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-5 h-5 text-primary-400 animate-spin mr-2" />
              <span className="text-sm text-gray-600">
                {processingMessage || 'Waiting for verification...'}
              </span>
            </div>

            {resendMessage && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  resendMessage.includes('sent')
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {resendMessage}
              </div>
            )}

            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-primary-400 hover:text-primary-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : "Didn't receive it? Resend link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
