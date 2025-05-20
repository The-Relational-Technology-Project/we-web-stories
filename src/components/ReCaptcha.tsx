
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Label } from '@/components/ui/label';

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  error?: boolean;
}

// Using a public test key for reCAPTCHA
// In production, this would be replaced with your actual site key
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const ReCaptcha = ({ onChange, error }: ReCaptchaProps) => {
  return (
    <div className="space-y-2">
      <Label className={error ? 'text-red-500' : ''}>
        Verify you're human
        {error && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="flex justify-start">
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={onChange}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">Please complete the CAPTCHA</p>
      )}
    </div>
  );
};

export default ReCaptcha;
