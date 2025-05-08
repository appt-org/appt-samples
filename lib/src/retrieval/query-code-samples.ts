import {
  samples,
  type Locale,
  type Framework,
  type TopicId,
} from "../generated";
import type { Topic, Loader } from "../types";
import {
  getContributionUrlForIntroduction,
  getContributionUrlForCodeSample,
  getImportPathForIntroduction,
  getImportPathForCodeSample,
} from "./utils";
import { frameworkIdToLabelMap } from "../frameworks";

interface CodeSamplesQuery {
  locale: Locale;
  topicIds?: Array<TopicId>;
  frameworks?: Array<Framework>;
}

/**
 * Retrieves topics and code samples based on specified query parameters and options.
 *
 * This function filters topics and code-samples by locale, topic-id, and/or framework.
 * If the topic-id or framework parameters are left empty, everything is retrieved.
 *
 * @param {Loader} loader - The loader to use
 * @param {CodeSamplesQuery} query - The query parameters for filtering code samples
 * @param {Locale} query.locale - The locale to get code samples from
 * @param {TopicId[]} [query.topicIds] - An optional array of topic IDs to retrieve by
 * @param {Framework[]} [query.frameworks] - An optional array of frameworks to retrieve by
 *
 * @returns {Topic[]} An array of topics matching the query parameters
 *
 * @example
 * // Get all code topics with all platforms for the 'en' locale
 * const allSamples = queryCodeSamples(loader, { locale: 'en' });
 *
 * @example
 * // Get all topics with code samples for Android and iOS, for the 'en' locale
 * const androidAndIosSamples = queryCodeSamples(
 *   loader,
 *   { locale: 'en', framework: ['android', 'ios'] },
 * );
 *
 * @example
 * // Get the Accessibility Role topic with all frameworks, in 'en' locale
 * const androidAndIosSamples = queryCodeSamples(
 *   loader,
 *   { locale: 'en', topicId: ['accessibility-role'] },
 * );
 */
export async function queryCodeSamples(
  loader: Loader,
  query: CodeSamplesQuery,
): Promise<Topic[]> {
  const results: Topic[] = [];
  const locale = query.locale;

  const topicsForLocale = samples[query.locale];

  for (const topicId of Object.keys(topicsForLocale) as TopicId[]) {
    if (query.topicIds && !query.topicIds.includes(topicId)) {
      continue;
    }

    results.push({
      locale,
      topicId,
      introduction: {
        contributionUrl: getContributionUrlForIntroduction(locale, topicId),
        importPath: getImportPathForIntroduction(locale, topicId),
        content: loader.loadTopicIntroduction(locale, topicId),
      },
      codeSamples: [],
    });

    const topicIndex = results.length - 1;

    const frameworksForSample = topicsForLocale[topicId];
    for (const framework of frameworksForSample) {
      if (query.frameworks && !query.frameworks.includes(framework)) {
        continue;
      }

      results[topicIndex].codeSamples.push({
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        contributionUrl: getContributionUrlForCodeSample(
          locale,
          topicId,
          framework,
        ),
        importPath: getImportPathForCodeSample(locale, topicId, framework),
        content: loader.loadCodeSample(locale, topicId, framework),
      });
    }
  }

  return results;
}
