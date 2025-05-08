import { samples, type Locale, type TopicId, Framework } from "../generated";
import type { Topic, Loader, CodeSample } from "../types";
import { frameworkIdToLabelMap } from "../frameworks";
import {
  getContributionUrlForIntroduction,
  getContributionUrlForCodeSample,
  getImportPathForIntroduction,
  getImportPathForCodeSample,
} from "./utils";

interface GetTopicQuery {
  locale: Locale;
  topicId: TopicId;
  frameworks?: Framework[];
}

/**
 * Retrieves a single topic and its code samples based on specified query parameters.
 *
 * This function fetches a topic by locale and topic ID, and optionally filters code samples
 * by framework. If the requested topic or locale does not exist, `null` is returned.
 * If the frameworks parameter is omitted, code samples for all available frameworks are included.
 *
 * @param {Loader} loader - The loader used to fetch topic introductions and code samples
 * @param {GetTopicQuery} query - The query parameters for retrieving the topic
 * @param {Locale} query.locale - The locale to fetch the topic from
 * @param {TopicId} query.topicId - The ID of the topic to retrieve
 * @param {Framework[]} [query.frameworks] - Optional array of frameworks to filter code samples by
 *
 * @returns {Promise<Topic|null>} The topic with its introduction and code samples, or `null` if not found
 *
 * @example
 * // Get the 'accessibility-role' topic with all available frameworks in 'en' locale
 * const topic = await getTopic(loader, { locale: 'en', topicId: 'accessibility-role' });
 *
 * @example
 * // Get the 'accessibility-role' topic, but only for the 'android' and 'ios' frameworks
 * const topic = await getTopic(loader, {
 *   locale: 'en',
 *   topicId: 'accessibility-role',
 *   frameworks: ['android', 'ios'],
 * });
 */
export async function getTopic(
  loader: Loader,
  query: GetTopicQuery,
): Promise<Topic | null> {
  const availableFrameworks = samples[query.locale]?.[query.topicId];
  if (!Array.isArray(availableFrameworks)) {
    return null;
  }

  const frameworks = query.frameworks
    ? availableFrameworks.filter((framework) =>
        query.frameworks?.includes(framework),
      )
    : availableFrameworks;

  return {
    locale: query.locale,
    topicId: query.topicId,
    introduction: {
      importPath: getImportPathForIntroduction(query.locale, query.topicId),
      contributionUrl: getContributionUrlForIntroduction(
        query.locale,
        query.topicId,
      ),
      content: await loader.loadTopicIntroduction(query.locale, query.topicId),
    },
    codeSamples: await Promise.all(
      frameworks.map<Promise<CodeSample>>(async (framework) => ({
        framework: {
          id: framework,
          label: frameworkIdToLabelMap[framework],
        },
        importPath: getImportPathForCodeSample(
          query.locale,
          query.topicId,
          framework,
        ),
        contributionUrl: getContributionUrlForCodeSample(
          query.locale,
          query.topicId,
          framework,
        ),
        content: await loader.loadCodeSample(
          query.locale,
          query.topicId,
          framework,
        ),
      })),
    ),
  };
}
