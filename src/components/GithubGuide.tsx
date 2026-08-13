import React, { useState } from 'react';
import { AppConfig } from '../types';
import { generateProjectFiles } from '../data/androidTemplates';
import { 
  GitBranch, 
  Workflow, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Terminal,
  AlertTriangle,
  FileCode2,
  FolderTree,
  Play
} from 'lucide-react';

interface GithubGuideProps {
  config: AppConfig;
  onDownloadZip: () => void;
}

export const GithubGuide: React.FC<GithubGuideProps> = ({ config, onDownloadZip }) => {
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [copiedYaml, setCopiedYaml] = useState<boolean>(false);

  const files = generateProjectFiles(config);
  const workflowFile = files.find(f => f.path.includes('.github'));
  const yamlContent = workflowFile ? workflowFile.content : '';

  const gitCommand = `git init
git add .
git commit -m "Build ${config.appName} WebView APK with PIN ${config.pinCode}"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/${config.appName.toLowerCase().replace(/\s+/g, '-')}-apk.git
git push -u origin main`;

  const handleCopyGit = () => {
    navigator.clipboard.writeText(gitCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-white space-y-8">
      
      {/* Hero Welcome */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-emerald-950/40 border border-indigo-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Automatic Cloud Build via GitHub Actions
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Build {config.appName} APK in 2 Minutes
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
            You do not need Android Studio installed on your computer! GitHub Actions cloud server will compile your Android project, embed PIN <span className="font-mono text-amber-400 font-bold">{config.pinCode}</span>, configure PDF downloads/sharing, and output <span className="font-mono text-emerald-400 font-bold">app-release.apk</span> automatically.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onDownloadZip}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Repository ZIP
            </button>

            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
            >
              Open GitHub.com <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* TROUBLESHOOTING CARD - WHY ACTION IS NOT TRIGGERING */}
      <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 text-white shadow-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3">
          <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-300">
              Why isn't GitHub Action triggering? (3 Common Causes & Fixes)
            </h3>
            <p className="text-xs text-slate-300">
              If your workflow did not start automatically after uploading files, check these 3 quick items:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Issue 1 */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Cause 1 (Most Common)
              </span>
              <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-indigo-400" />
                Missing <code className="text-xs font-mono text-amber-300">.github</code> folder
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Folders starting with a dot (<code className="text-amber-300">.github</code>) are <b>hidden files</b> on Windows & Mac! If you dragged files into GitHub web upload, the workflow file was likely skipped.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-xs font-bold text-emerald-400 block mb-1">Quick Fix:</span>
              <p className="text-[11px] text-slate-300 mb-2">
                Create file manually on GitHub at path:
              </p>
              <div className="p-2 bg-slate-900 rounded-lg font-mono text-[11px] text-amber-300 truncate mb-2">
                .github/workflows/build-apk.yml
              </div>
              <button
                onClick={handleCopyYaml}
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedYaml ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>YAML Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Workflow YAML Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Issue 2 */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Cause 2
              </span>
              <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Actions Disabled in Settings
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                GitHub repositories often disable Actions or restrict workflow permissions on new accounts by default.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-xs font-bold text-emerald-400 block mb-1">Quick Fix:</span>
              <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside">
                <li>Go to GitHub Repo -&gt; <b>Settings</b></li>
                <li>Click <b>Actions</b> -&gt; <b>General</b></li>
                <li>Select <b>"Allow all actions"</b></li>
                <li>Set Workflow permissions to <b>"Read and write permissions"</b></li>
              </ol>
            </div>
          </div>

          {/* Issue 3 */}
          <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Cause 3
              </span>
              <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-1.5">
                <Play className="w-4 h-4 text-emerald-400" />
                Manual Trigger Required
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If pushed via web interface or non-main branch, GitHub requires manually clicking "Run workflow".
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-xs font-bold text-emerald-400 block mb-1">Quick Fix:</span>
              <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside">
                <li>Click <b>Actions</b> tab on GitHub</li>
                <li>Select <b>"Build Android WebView APK"</b> on left menu</li>
                <li>Click <b>Run workflow</b> button on the right!</li>
              </ol>
            </div>
          </div>

        </div>
      </div>

      {/* 3 Step Visual Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-white mb-2">Create GitHub Repository</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Download the exported repository ZIP file above, extract it, and upload all files (including hidden <code className="text-amber-300">.github</code> folder) to a new GitHub repository.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            Repo Name: <span className="text-indigo-400 font-bold">{config.appName.toLowerCase().replace(/\s+/g, '-')}-apk</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-white mb-2">Run GitHub Action</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Go to your repository on GitHub -&gt; Click <span className="text-indigo-300 font-semibold">Actions</span> -&gt; Select <span className="text-indigo-300 font-semibold">Build Android WebView APK</span> -&gt; Click <span className="text-indigo-300 font-semibold">Run workflow</span>.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <Workflow className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Build time: ~2 minutes</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-white mb-2">Download Your APK File</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              When the workflow completes with a green checkmark ✅, scroll down to <span className="text-emerald-300 font-semibold">Artifacts</span> and download your compiled APK file!
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-white flex items-center justify-between">
            <span className="truncate">{config.appName.toLowerCase().replace(/\s+/g, '-')}-release-apk</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        </div>

      </div>

      {/* Terminal Command Snippet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">
              Recommended: Git Command Line Push (Preserves Hidden Folders)
            </h3>
          </div>

          <button
            onClick={handleCopyGit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            {copiedCmd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Commands</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
          {gitCommand}
        </pre>
      </div>

      {/* Embedded Verification Features Checklist */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl">
        <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Configured Mobile Permissions & Capabilities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Security PIN Lock ({config.pinCode})</span>
              <span className="text-slate-400">Requires entering PIN "{config.pinCode}" before opening {config.websiteUrl}.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">PDF Download & Storage</span>
              <span className="text-slate-400">Uses DownloadManager with WRITE_EXTERNAL_STORAGE permissions.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Native PDF Sharing</span>
              <span className="text-slate-400">Uses FileProvider for instant sharing via WhatsApp, Gmail, and Drive.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Safe Back Navigation</span>
              <span className="text-slate-400">Navigates web history; double back press exits safely with Toast.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

