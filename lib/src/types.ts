import type { Locale, Platform, SampleId } from "./generated";

export interface CodeSample {
  locale: Locale;
  sampleId: SampleId;
  introduction: ImportableMarkdown;
  platforms: PlatformCodeSample[];
}

export interface PlatformCodeSample extends ImportableMarkdown {
  platform: {
    id: Platform;
    label: string;
  };
}

export interface Loader {
  loadPlatformSample: (
    locale: Locale,
    sampleId: SampleId,
    platform: Platform,
  ) => Promise<any>;
  loadSampleIntroduction: (locale: Locale, sampleId: SampleId) => Promise<any>;
}

export interface ImportableMarkdown {
  importPath: string;
  contributionUrl: string;
  content: any;
}
