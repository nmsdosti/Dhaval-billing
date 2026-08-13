import React, { useState } from 'react';
import { AppConfig, ViewTab } from './types';
import { Header } from './components/Header';
import { MobileSimulator } from './components/MobileSimulator';
import { CodeViewer } from './components/CodeViewer';
import { GithubGuide } from './components/GithubGuide';
import { ConfigPanel } from './components/ConfigPanel';
import { downloadProjectZip } from './utils/zipExporter';
import { Smartphone, Workflow, Code2, BookOpen, ShieldCheck, Download, KeyRound, Sparkles } from 'lucide-react';

const defaultConfig: AppConfig = {
  appName: "Ram Billing",
  packageName: "com.rambilling.app",
  websiteUrl: "https://app.rambilling.com",
  pinCode: "8460",
  enablePin: true,
  enablePdfDownload: true,
  enableFileShare: true,
  enableBackNavigation: true,
  primaryColor: "#F59E0B",
  appVersion: "1.0.0",
  versionCode: 1,
};

export default function App() {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<ViewTab>('simulator');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const handleDownloadZip = () => {
    downloadProjectZip(config);
  };

  const handleResetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Bar */}
      <Header
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        isUnlocked={isUnlocked}
        onLockApp={() => setIsUnlocked(false)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        
        {/* Quick Summary Banner for Users */}
        <div className="bg-slate-900/80 border-b border-slate-800/80 py-3 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">
                Configured: Website <span className="text-indigo-300 font-mono font-semibold">{config.websiteUrl}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <KeyRound className="w-3 h-3" /> PIN: {config.pinCode}
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> PDF Download & Share
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-indigo-400">
                <Sparkles className="w-3 h-3" /> Safe Back Exit
              </span>
            </div>
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === 'simulator' && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            
            {/* Intro Header */}
            <div className="text-center max-w-xl mx-auto mb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Interactive WebView Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Test PIN login <span className="text-amber-400 font-mono font-bold">{config.pinCode}</span>, PDF download handling, and back button press behavior right here in the live preview.
              </p>
            </div>

            <MobileSimulator
              config={config}
              isUnlocked={isUnlocked}
              onUnlock={() => setIsUnlocked(true)}
              onLock={() => setIsUnlocked(false)}
            />
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="pt-4">
            <CodeViewer
              config={config}
              onDownloadZip={handleDownloadZip}
              filterLanguage="yaml"
            />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="pt-4">
            <CodeViewer
              config={config}
              onDownloadZip={handleDownloadZip}
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="pt-4">
            <GithubGuide
              config={config}
              onDownloadZip={handleDownloadZip}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="pt-4">
            <ConfigPanel
              config={config}
              setConfig={setConfig}
              onReset={handleResetConfig}
            />
          </div>
        )}

      </main>

      {/* Floating Bottom Action Bar for Quick Export */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/90 border-t border-slate-800 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline font-medium">
              Ready to generate <span className="text-white font-bold">{config.appName}</span> APK on GitHub Actions
            </span>
            <span className="sm:hidden font-medium truncate">
              {config.appName} APK Builder
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('guide')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              Setup Guide
            </button>

            <button
              onClick={handleDownloadZip}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
