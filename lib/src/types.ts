import type { Locale, Framework, TopicId } from "./generated";

export interface Topic {
  locale: Locale;
  topicId: TopicId;
  introduction: ImportableMarkdown;
  codeSamples: CodeSample[];
}

export interface CodeSample extends ImportableMarkdown {
  framework: {
    id: Framework;
    label: string;
  };
}

export interface Loader {
  loadCodeSample: (
    locale: Locale,
    topicId: TopicId,
    framework: Framework,
  ) => Promise<any>;
  loadTopicIntroduction: (locale: Locale, topicId: TopicId) => Promise<any>;
}

interface ImportableMarkdown {
  importPath: string;
  contributionUrl: string;
  content: any;
}
