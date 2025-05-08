import type { Locale, Framework, Technique } from "./generated";

export interface Topic {
  locale: Locale;
  technique: Technique;
  introduction: Introduction;
  samples: Sample[];
}

export interface Introduction extends ImportableMarkdown {}

export interface Sample extends ImportableMarkdown {
  framework: {
    id: Framework;
    label: string;
  };
}

/**
 * Interface for loading topic introductions and samples from the node_modules folder.
 *
 * Implementations of this interface provide methods to asynchronously load
 * topic introductions and samples for a given path, locale, topic, and framework.
 * The Loader abstraction allows the rest of the system to remain agnostic to the underlying
 * retrieval mechanism (e.g., Webpack context, import.meta.glob, etc.).
 *
 * @interface Loader
 *
 * @property {function(path: string, Locale, Technique, Framework): Promise<any>} loadSample
 *   Loads a sample for the specified locale, topic, and framework.
 *   Returns a Promise resolving to the sample content.
 *
 * @property {function(path: string, Locale, Technique): Promise<any>} loadTopicIntroduction
 *   Loads the topic introduction for the specified locale and topic.
 *   Returns a Promise resolving to the introduction content.
 */
export interface Loader {
  loadSample: (
    path: string,
    locale: Locale,
    technique: Technique,
    framework: Framework,
  ) => Promise<any>;
  loadTopicIntroduction: (
    path: string,
    locale: Locale,
    technique: Technique,
  ) => Promise<any>;
}

interface ImportableMarkdown {
  /**
   * Local import path for the .md file.
   * @example @appt/samples/samples/en.accessibility-role.android.md
   */
  path: string;
  /**
   * The GitHub URL for .md file.
   */
  url: string;
  content: any;
}
