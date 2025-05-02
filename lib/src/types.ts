import type { Locale, Platform, SampleId } from "./generated";

export interface CodeSampleMetadata {
  locale: Locale;
  sampleId: SampleId;
  platform: {
    id: Platform;
    label: string;
  };
  contributionUrl: string;
  contentPath: string;
}

export interface CodeSample extends CodeSampleMetadata {
  // TODO: add jsdoc comment about the type
  content: any;
}

// TODO: add jsdoc comment about the type
export type Loader = (
  locale: Locale,
  sampleId: SampleId,
  platform: Platform,
) => Promise<any>;
