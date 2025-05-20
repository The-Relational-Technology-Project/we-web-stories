
import React, { useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Label } from '@/components/ui/label';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  error?: boolean;
}

// Your actual reCAPTCHA v3 site key
const RECAPTCHA_SITE_KEY = '6Lfg90ErAAAAAFwdeltNZN4VVxSAJgVBgXiBERwG';

const ReCaptcha = ({ onChange, error }: ReCaptchaProps) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  useEffect(() => {
    // Execute reCAPTCHA when component mounts (for v3 invisible captcha)
    const executeRecaptcha = async () => {
      if (recaptchaRef.current) {
        const token = await recaptchaRef.current.executeAsync();
        onChange(token);
      }
    };
    
    executeRecaptcha();
  }, [onChange]);
  
  return (
    <div className="space-y-2">
      <Label className={error ? 'text-red-500' : ''}>
        Verification
        {error && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="hidden">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={onChange}
          size="invisible"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">Human verification failed. Please try again.</p>
      )}
    </div>
  );
};

export default ReCaptcha;
