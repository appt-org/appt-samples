import {
  samples,
  type Locale,
  type Framework,
  type TopicId,
} from "../generated";
import type { Topic, Loader } from "../types";
import {
  getContributionUrlForIntroduction,
  getContributionUrlForSample,
  getImportPathForIntroduction,
  getImportPathForSample,
} from "./utils";
import { frameworkIdToLabelMap } from "../frameworks";

interface SamplesQuery {
  locale: Locale;
  topicIds?: Array<TopicId>;
  frameworks?: Array<Framework>;
}

/**
 * Retrieves topics and samples based on specified query parameters and options.
 *
 * This function filters topics and samples by locale, topic-id, and/or framework.
 * If the topic-id or framework parameters are left empty, everything is retrieved.
 *
 * @param {Loader} loader - The loader to use
 * @param {SamplesQuery} query - The query parameters for filtering samples
 * @param {Locale} query.locale - The locale to get samples from
 * @param {TopicId[]} [query.topicIds] - An optional array of topic IDs to retrieve by
 * @param {Framework[]} [query.frameworks] - An optional array of frameworks to retrieve by
 *
 * @returns {Topic[]} An array of topics matching the query parameters
 *
 * @example
 * // Get all topics with all platforms for the 'en' locale
 * const allSamples = querySamples(loader, { locale: 'en' });
 *
 * @example
 * // Get all topics with samples for Android and iOS, for the 'en' locale
 * const androidAndIosSamples = querySamples(
 *   loader,
 *   { locale: 'en', framework: ['android', 'ios'] },
 * );
 *
 * @example
 * // Get the Accessibility Role topic with all frameworks, in 'en' locale
 * const androidAndIosSamples = querySamples(
 *   loader,
 *   { locale: 'en', topicId: ['accessibility-role'] },
 * );
 */
export async function querySamples(
  loader: Loader,
  query: SamplesQuery,
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
      samples: [],
    });

    const topicIndex = results.length - 1;

    const frameworksForSample = topicsForLocale[topicId];
    for (const framework of frameworksForSample) {
      if (query.frameworks && !query.frameworks.includes(framework)) {
        continue;
      }

      results[topicIndex].samples.push({
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        contributionUrl: getContributionUrlForSample(
          locale,
          topicId,
          framework,
        ),
        importPath: getImportPathForSample(locale, topicId, framework),
        content: loader.loadSample(locale, topicId, framework),
      });
    }
  }

  return results;
}
