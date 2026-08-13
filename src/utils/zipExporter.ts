import JSZip from 'jszip';
import { AppConfig } from '../types';
import { generateProjectFiles } from '../data/androidTemplates';

export async function downloadProjectZip(config: AppConfig): Promise<void> {
  const zip = new JSZip();
  const files = generateProjectFiles(config);

  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  // Add dummy gradlew script file for completeness
  zip.file('gradlew', '#!/usr/bin/env sh\nexec gradle "$@"\n');
  zip.file('gradlew.bat', '@rem Gradle startup script for Windows\n');

  const content = await zip.generateAsync({ type: 'blob' });
  
  const fileName = `${config.appName.toLowerCase().replace(/\s+/g, '-')}-github-apk-repo.zip`;
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
