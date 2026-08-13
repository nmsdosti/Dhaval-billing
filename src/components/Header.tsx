import React from 'react';
import { AppConfig, ViewTab } from '../types';
import { 
  Smartphone, 
  Code2, 
  Workflow, 
  BookOpen, 
  Settings, 
  Download, 
  Lock, 
  KeyRound, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  config: AppConfig;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  onDownloadZip: () => void;
  isUnlocked: boolean;
  onLockApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  activeTab,
  setActiveTab,
  onDownloadZip,
  isUnlocked,
  onLockApp,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">
                  {config.appName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3" /> GitHub Action Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[220px] sm:max-w-md">
                Target: <span className="text-slate-300 font-mono">{config.websiteUrl}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              App Simulator
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'workflow'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              GitHub Action
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Android Code
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              APK Tutorial
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Customize
            </button>
          </nav>

          {/* Actions: Security Badge & Download Zip Button */}
          <div className="flex items-center gap-2">
            
            {/* PIN Badge / Re-lock */}
            <button
              onClick={onLockApp}
              title={isUnlocked ? "Click to Lock App with PIN" : "PIN Locked"}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                isUnlocked
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              PIN: <span className="underline decoration-dotted">{config.pinCode}</span>
              {isUnlocked ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <Lock className="w-3 h-3 text-amber-400" />
              )}
            </button>

            {/* Direct Link */}
            <a
              href={config.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Open Target Web Page in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Download Repository Zip */}
            <button
              onClick={onDownloadZip}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export APK Repo (.zip)</span>
              <span className="sm:hidden">Zip</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'simulator' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Simulator
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'workflow' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            GitHub Action
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'guide' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Guide
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Config
          </button>
        </div>

      </div>
    </header>
  );
};
