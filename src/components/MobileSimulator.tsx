import React, { useState, useRef } from 'react';
import { AppConfig } from '../types';
import { PinPadModal } from './PinPadModal';
import { 
  Wifi, 
  Battery, 
  RefreshCw, 
  Lock, 
  Share2, 
  Download, 
  FileText, 
  ExternalLink, 
  ArrowLeft, 
  Home, 
  Square, 
  Smartphone,
  CheckCircle2,
  Maximize2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface MobileSimulatorProps {
  config: AppConfig;
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  config,
  isUnlocked,
  onUnlock,
  onLock,
}) => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(1);
  const [lastBackPressTime, setLastBackPressTime] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [rotated, setRotated] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
    setIframeError(false);
    showToast("Reloaded website...");
  };

  // Safe Android Back Button logic simulation
  const handleAndroidBack = () => {
    if (!isUnlocked) {
      showToast("App is locked with PIN.");
      return;
    }

    if (historyCount > 1) {
      setHistoryCount((prev) => prev - 1);
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.history.back();
        } catch {
          // ignore cross-origin history error
        }
      }
      showToast("Navigated back in WebView");
    } else {
      const now = Date.now();
      if (now - lastBackPressTime < 2200) {
        onLock();
        showToast(`Exited ${config.appName} safely to PIN lock screen.`);
      } else {
        setLastBackPressTime(now);
        showToast(`Press back again to exit ${config.appName}`);
      }
    }
  };

  // Simulate PDF Download
  const handleSimulatePdfDownload = () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadProgress(null);
            showToast("Invoice_RamBilling_2026.pdf downloaded!");
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Simulate PDF Share
  const handleSimulateShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ram Billing Invoice PDF',
          text: 'Here is the invoice PDF generated from Ram Billing App',
          url: config.websiteUrl,
        });
        showToast("Shared invoice successfully!");
      } catch {
        setShareModalOpen(true);
      }
    } else {
      setShareModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 sm:px-4 text-white">
      
      {/* Simulator Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-md mb-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">Live Device Wrapper</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRotated(!rotated)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
          >
            {rotated ? "Portrait" : "Rotate"}
          </button>

          {isUnlocked && (
            <button
              onClick={onLock}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Lock App
            </button>
          )}
        </div>
      </div>

      {/* Main Phone Mockup Frame */}
      <div className={`relative transition-all duration-300 bg-slate-950 border-[10px] border-slate-800 rounded-[44px] shadow-2xl shadow-indigo-950/40 overflow-hidden flex flex-col ${
        rotated ? 'w-[680px] h-[360px]' : 'w-full max-w-[380px] h-[720px]'
      }`}>
        
        {/* Dynamic Notch / Camera Hole */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-900/80" />
        </div>

        {/* Android Status Bar */}
        <div className="pt-3 px-6 pb-1 bg-slate-900 text-slate-300 text-[11px] font-mono flex items-center justify-between select-none z-20 shrink-0 border-b border-slate-800/50">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1 rounded font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Top App Header / URL Bar */}
        <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 z-20 shrink-0">
          <div className="flex items-center gap-1.5 flex-1 bg-slate-950 px-2.5 py-1.5 rounded-lg text-xs border border-slate-800 overflow-hidden">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="font-mono text-[11px] text-slate-300 truncate">
              {config.websiteUrl}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            title="Reload Page"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PDF Download & Share Quick Test Bar (Native Android Capability Indicator) */}
        {isUnlocked && (
          <div className="bg-slate-900/95 border-b border-slate-800/80 px-3 py-1.5 flex items-center justify-between text-[11px] z-20 shrink-0">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Engine</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSimulatePdfDownload}
                className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 text-[10px] transition-colors"
              >
                <Download className="w-3 h-3" />
                Test Download
              </button>

              <button
                onClick={handleSimulateShare}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1 text-[10px] transition-colors"
              >
                <Share2 className="w-3 h-3 text-emerald-400" />
                Test Share
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="relative flex-1 bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
          
          {/* Download Progress Banner */}
          {downloadProgress !== null && (
            <div className="absolute top-2 left-2 right-2 z-30 bg-indigo-950 border border-indigo-500/50 p-2.5 rounded-xl text-xs text-white shadow-xl animate-fade-in">
              <div className="flex items-center justify-between mb-1 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <Download className="w-3.5 h-3.5 animate-bounce" /> Downloading PDF...
                </span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {!isUnlocked ? (
            /* PIN Gate Screen */
            <div className="p-4 w-full h-full flex items-center justify-center bg-slate-950 overflow-y-auto">
              <PinPadModal
                requiredPin={config.pinCode}
                onSuccess={onUnlock}
                title="Ram Billing Security"
                subtitle={`Enter PIN "${config.pinCode}" to load application`}
              />
            </div>
          ) : (
            /* Unlocked Website View */
            <div className="w-full h-full relative bg-white">
              {iframeError ? (
                /* Fallback if external site blocks embedded iframe display */
                <div className="w-full h-full bg-slate-950 text-white p-6 flex flex-col items-center justify-center text-center">
                  <ShieldAlert className="w-12 h-12 text-amber-400 mb-3" />
                  <h3 className="font-bold text-base text-white mb-1">
                    Frame Preview Protected
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 max-w-xs leading-relaxed">
                    <span className="text-indigo-400 font-mono">{config.websiteUrl}</span> is configured for security. In the final compiled Android APK, it runs inside native Android WebView smoothly!
                  </p>
                  
                  <a
                    href={config.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Open Live Web Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={config.websiteUrl}
                  title="Ram Billing Live Webview"
                  className="w-full h-full border-0 bg-white"
                  onError={() => setIframeError(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                />
              )}
            </div>
          )}

          {/* Toast Notification Bar */}
          {toastMessage && (
            <div className="absolute bottom-4 left-4 right-4 z-40 bg-slate-900/95 border border-indigo-500/40 text-white px-3.5 py-2 rounded-xl text-xs text-center shadow-2xl font-medium backdrop-blur-md animate-slide-up flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

        </div>

        {/* Bottom Android Navigation Bar */}
        <div className="py-2.5 px-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-slate-400 select-none shrink-0 z-20">
          
          {/* Back Button (◁) */}
          <button
            onClick={handleAndroidBack}
            title="Android Back Button (Safe Exit on Double Press)"
            className="p-2 hover:text-white active:scale-90 transition-all text-indigo-400 hover:bg-slate-800 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Home Button (◯) */}
          <button
            onClick={() => {
              if (isUnlocked) {
                showToast("Minimized to Home Screen");
              } else {
                showToast("Please enter PIN first.");
              }
            }}
            title="Android Home Button"
            className="p-2 hover:text-white active:scale-90 transition-all hover:bg-slate-800 rounded-xl"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Recent Apps Button (▢) */}
          <button
            onClick={() => showToast("Recent Apps Overview")}
            title="Recent Apps Overview"
            className="p-2 hover:text-white active:scale-90 transition-all hover:bg-slate-800 rounded-xl"
          >
            <Square className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Share Modal Simulation */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-white">
            <h3 className="font-bold text-base mb-2 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" />
              Share Invoice PDF
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Native Android FileProvider shares <span className="text-indigo-300 font-mono">Invoice_RamBilling.pdf</span> via WhatsApp, Gmail, or Drive.
            </p>

            <div className="space-y-2 mb-6 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span>WhatsApp / Business</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span>Gmail / Email Attachments</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span>Save to Files / Google Drive</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <button
              onClick={() => {
                setShareModalOpen(false);
                showToast("PDF Share Sheet dismissed.");
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs rounded-xl"
            >
              Close Share Sheet
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
