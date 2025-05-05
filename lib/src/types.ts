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

/**
 * Interface for loading topic introductions and code samples from the node_modules folder.
 *
 * Implementations of this interface provide methods to asynchronously load
 * topic introductions and code samples for a given locale, topic, and framework.
 * The Loader abstraction allows the rest of the system to remain agnostic to the underlying
 * retrieval mechanism (e.g., Webpack context, import.meta.glob, etc.).
 *
 * @interface Loader
 *
 * @property {function(Locale, TopicId, Framework): Promise<any>} loadCodeSample
 *   Loads a code sample for the specified locale, topic, and framework.
 *   Returns a Promise resolving to the code sample content.
 *
 * @property {function(Locale, TopicId): Promise<any>} loadTopicIntroduction
 *   Loads the topic introduction for the specified locale and topic.
 *   Returns a Promise resolving to the introduction content.
 */
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
