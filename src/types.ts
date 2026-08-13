export interface AppConfig {
  appName: string;
  packageName: string;
  websiteUrl: string;
  pinCode: string;
  enablePin: boolean;
  enablePdfDownload: boolean;
  enableFileShare: boolean;
  enableBackNavigation: boolean;
  primaryColor: string;
  appVersion: string;
  versionCode: number;
}

export type ViewTab = 'simulator' | 'code' | 'workflow' | 'guide' | 'settings';

export interface GeneratedFile {
  path: string;
  name: string;
  language: string;
  content: string;
  description: string;
}
