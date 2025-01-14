import React, { useEffect, useRef, useState } from 'react';

interface InputCodeProps {
  length: number;
  onChange: (code: string) => void;
  value?: string;
  containerClassName?: string;
}

export const InputCode = React.forwardRef<HTMLDivElement, InputCodeProps>(
  ({ length, onChange, value = '', containerClassName = '' }, ref) => {
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    // Update internal state when value prop changes
    useEffect(() => {
      if (value) {
        const valueArray = value.split('').slice(0, length);
        setCode(valueArray.concat(Array(length - valueArray.length).fill('')));
      }
    }, [value, length]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (newValue.length > 1) return; // Prevent multi-character input

      const newCode = [...code];
      newCode[index] = newValue;
      setCode(newCode);

      // Call onChange with the complete string
      const updatedCode = newCode.join('');
      onChange(updatedCode);

      // Move to next input if value is entered
      if (newValue && index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !code[index] && index > 0) {
        // Move to previous input on backspace if current input is empty
        inputs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').slice(0, length);
      const newCode = [...Array(length).fill('')];
      
      pastedData.split('').forEach((char, index) => {
        if (index < length) newCode[index] = char;
      });

      setCode(newCode);
      onChange(newCode.join(''));
    };

    return (
      <div ref={ref} className={`flex gap-2 ${containerClassName}`}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-10 h-10 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
    );
  }
);

InputCode.displayName = 'InputCode';