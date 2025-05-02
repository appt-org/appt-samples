import type { Locale, Platform, SampleId } from "./generated";

export interface CodeSampleMetadata {
  locale: Locale;
  sampleId: SampleId;
  platform: Platform;
  contributionUrl: string;
  contentPath: string;
}

export interface CodeSample extends CodeSampleMetadata {
  // TODO: add jsdoc comment about the type
  content: any;
}

export type Loader = (
  codeSampleMetadata: CodeSampleMetadata,
) => Promise<CodeSample>;
