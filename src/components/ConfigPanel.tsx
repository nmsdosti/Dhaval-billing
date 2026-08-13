import React from 'react';
import { AppConfig } from '../types';
import { LordRamLogo } from './LordRamLogo';
import { Settings, Lock, Download, Smartphone, Share2, Globe, Shield, RefreshCw, Sparkles } from 'lucide-react';

interface ConfigPanelProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onReset: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, onReset }) => {
  const handleChange = (key: keyof AppConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white">
      
      {/* Lord Ram Emblem Badge Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-500/30 p-5 rounded-2xl mb-6 flex items-center gap-4 text-white">
        <div className="p-2.5 bg-slate-950 rounded-2xl border border-amber-500/40 shadow-lg shadow-amber-500/20">
          <LordRamLogo size={56} showText={false} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-extrabold text-amber-300">
              Lord Ram Emblem & App Logo
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Active Logo
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sacred Suryavanshi Bow & Arrow vector logo integrated into APK launcher icons, splash screen, PIN login header, and top action bar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic App Details */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-indigo-300 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Smartphone className="w-4 h-4" />
            Basic App Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              App Name
            </label>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Website URL
            </label>
            <div className="relative mb-2">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="url"
                value={config.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Quick URL:</span>
              <button
                type="button"
                onClick={() => handleChange('websiteUrl', 'https://app.rambilling.com')}
                className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                  config.websiteUrl === 'https://app.rambilling.com'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                app.rambilling.com
              </button>              <button
                type="button"
                onClick={() => handleChange('websiteUrl', 'https://ram-billing.lovable.app/')}
                className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                  config.websiteUrl === 'https://ram-billing.lovable.app/'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                ram-billing.lovable.app
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Android Package ID (e.g. com.rambilling.app)
            </label>
            <input
              type="text"
              value={config.packageName}
              onChange={(e) => handleChange('packageName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono text-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Version Name
              </label>
              <input
                type="text"
                value={config.appVersion}
                onChange={(e) => handleChange('appVersion', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Version Code
              </label>
              <input
                type="number"
                value={config.versionCode}
                onChange={(e) => handleChange('versionCode', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security & Feature Toggles */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-indigo-300 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4" />
            Security & Feature Settings
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Login PIN Code
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={config.pinCode}
                onChange={(e) => handleChange('pinCode', e.target.value)}
                maxLength={8}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-amber-500/30 rounded-xl text-xs text-amber-400 font-mono font-bold tracking-widest text-base focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Currently set to user requested PIN <span className="text-amber-400 font-bold">{config.pinCode}</span>.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">Require PIN Lock Screen</span>
              </div>
              <input
                type="checkbox"
                checked={config.enablePin}
                onChange={(e) => handleChange('enablePin', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">PDF Download Permissions</span>
              </div>
              <input
                type="checkbox"
                checked={config.enablePdfDownload}
                onChange={(e) => handleChange('enablePdfDownload', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">FileProvider PDF Sharing</span>
              </div>
              <input
                type="checkbox"
                checked={config.enableFileShare}
                onChange={(e) => handleChange('enableFileShare', e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

      </div>

    </div>
  );
};
