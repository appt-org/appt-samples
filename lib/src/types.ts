import type { Locale, Framework, SampleId } from "./generated";

export interface CodeSample {
  locale: Locale;
  sampleId: SampleId;
  introduction: ImportableMarkdown;
  frameworks: FrameworkCodeSample[];
}

export interface FrameworkCodeSample extends ImportableMarkdown {
  framework: {
    id: Framework;
    label: string;
  };
}

export interface Loader {
  loadFrameworkSample: (
    locale: Locale,
    sampleId: SampleId,
    framework: Framework,
  ) => Promise<any>;
  loadSampleIntroduction: (locale: Locale, sampleId: SampleId) => Promise<any>;
}

export interface ImportableMarkdown {
  importPath: string;
  contributionUrl: string;
  content: any;
}
