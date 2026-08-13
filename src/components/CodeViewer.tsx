import React, { useState } from 'react';
import { AppConfig, GeneratedFile } from '../types';
import { generateProjectFiles } from '../data/androidTemplates';
import { Copy, Check, FileCode, Download, ExternalLink, Workflow, Code } from 'lucide-react';

interface CodeViewerProps {
  config: AppConfig;
  onDownloadZip: () => void;
  filterLanguage?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ config, onDownloadZip, filterLanguage }) => {
  const files = generateProjectFiles(config);
  
  const displayFiles = filterLanguage 
    ? files.filter(f => f.language === filterLanguage)
    : files;

  const [selectedFile, setSelectedFile] = useState<GeneratedFile>(displayFiles[0] || files[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-white">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-2xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Code className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">Generated Android Kotlin & GitHub Action Source Code</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            All code files are configured for <span className="text-indigo-300 font-semibold">{config.appName}</span> target URL <span className="text-slate-200 font-mono">{config.websiteUrl}</span> with PIN <span className="text-amber-400 font-mono font-bold">{config.pinCode}</span>, download permissions, and safe back button exit handler.
          </p>
        </div>

        <button
          onClick={onDownloadZip}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          Download All Files (.zip)
        </button>
      </div>

      {/* Editor Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* File Tree Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col h-[560px] overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span>Project Explorer</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              {files.length} files
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2 space-y-1">
            {files.map((file) => {
              const isSelected = selectedFile.path === file.path;
              const isWorkflow = file.path.includes('.github');
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isWorkflow ? (
                      <Workflow className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                    )}
                    <span className="truncate">{file.name}</span>
                  </div>

                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Panel */}
        <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[560px]">
          
          {/* File Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-indigo-300">
                  {selectedFile.path}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed selection:bg-indigo-600 selection:text-white">
            <pre className="whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
