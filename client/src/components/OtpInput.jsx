import React, { useState, useRef } from 'react';

export default function OtpInput({ onComplete, length = 6 }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const combined = newOtp.join('');
    if (combined.length === length) {
      onComplete(combined);
    }

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2.5 justify-center my-4">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-11 h-12 text-center text-lg font-bold bg-navy-900 border-2 border-slate-700 text-signal-400 rounded-xl focus:border-signal-500 focus:outline-none transition-colors shadow-inner"
        />
      ))}
    </div>
  );
}
