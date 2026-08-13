import React, { useState } from 'react';
import { Delete, CheckCircle2, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { LordRamLogo } from './LordRamLogo';

interface PinPadModalProps {
  requiredPin: string;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export const PinPadModal: React.FC<PinPadModalProps> = ({
  requiredPin,
  onSuccess,
  title = "Security PIN Login Required",
  subtitle = "Please enter the 4-digit PIN to unlock and access Ram Billing WebView",
}) => {
  const [inputPin, setInputPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  const handleKeyPress = (num: string) => {
    if (inputPin.length < 8) {
      const newPin = inputPin + num;
      setInputPin(newPin);
      setErrorMsg(null);

      // Auto check when length matches required pin length
      if (newPin.length === requiredPin.length) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setInputPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleClear = () => {
    setInputPin('');
    setErrorMsg(null);
  };

  const verifyPin = (pinToTest: string) => {
    if (pinToTest === requiredPin) {
      setIsSuccess(true);
      setErrorMsg(null);
      setTimeout(() => {
        onSuccess();
      }, 600);
    } else {
      setShake(true);
      setErrorMsg(`Incorrect PIN "${pinToTest}". Try entering "${requiredPin}".`);
      setTimeout(() => {
        setShake(false);
        setInputPin('');
      }, 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-sm w-full mx-auto text-white">
      
      {/* Lord Ram Logo Badge */}
      <div className={`p-2 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
        isSuccess 
          ? 'bg-emerald-500/20 border border-emerald-500/40 scale-110' 
          : 'bg-gradient-to-tr from-amber-600/30 to-orange-500/20 border border-amber-500/40 shadow-lg shadow-amber-500/20'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
        ) : (
          <LordRamLogo size={48} showText={false} />
        )}
      </div>

      <h2 className="text-xl font-bold text-center text-white mb-1">
        {title}
      </h2>
      <p className="text-xs text-slate-400 text-center mb-6 leading-relaxed">
        {subtitle}
      </p>

      {/* PIN Indicator Dots */}
      <div className={`flex justify-center items-center gap-3 mb-6 p-3 rounded-xl bg-slate-950 border border-slate-800/80 w-full ${
        shake ? 'animate-bounce border-red-500/50 bg-red-950/20' : ''
      }`}>
        {Array.from({ length: Math.max(requiredPin.length, 4) }).map((_, idx) => {
          const isFilled = idx < inputPin.length;
          return (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                isSuccess
                  ? 'bg-emerald-400 scale-110 shadow-lg shadow-emerald-400/50'
                  : isFilled
                  ? 'bg-indigo-500 scale-110 shadow-md shadow-indigo-500/40'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          );
        })}
      </div>

      {/* Error / Success Feedback */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg mb-4 text-center font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isSuccess && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg mb-4 text-center font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Access Granted! Opening Ram Billing...</span>
        </div>
      )}

      {/* Numerical Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full mb-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            disabled={isSuccess}
            className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-indigo-600 active:scale-95 text-white font-bold text-lg shadow border border-slate-700/50 transition-all flex items-center justify-center"
          >
            {num}
          </button>
        ))}

        <button
          onClick={handleClear}
          disabled={isSuccess || inputPin.length === 0}
          className="h-12 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition-all flex items-center justify-center disabled:opacity-30"
        >
          Clear
        </button>

        <button
          onClick={() => handleKeyPress('0')}
          disabled={isSuccess}
          className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-indigo-600 active:scale-95 text-white font-bold text-lg shadow border border-slate-700/50 transition-all flex items-center justify-center"
        >
          0
        </button>

        <button
          onClick={handleDelete}
          disabled={isSuccess || inputPin.length === 0}
          className="h-12 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition-all flex items-center justify-center disabled:opacity-30"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Auto-Fill PIN Button */}
      <button
        onClick={() => {
          setInputPin(requiredPin);
          verifyPin(requiredPin);
        }}
        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono transition-colors"
      >
        <KeyRound className="w-3.5 h-3.5" />
        Auto-enter requested PIN "{requiredPin}"
      </button>

    </div>
  );
};
